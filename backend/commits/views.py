import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ParseError

from common.utils import github_request
from .utils import webhook_commit_parser, bulk_insert_commit_parser, save_multiple_commits
from .models import Commit, Repository
from .serializers import (
    CommitSerializer,
    RepositorySerializer,
    RepositoryCommitsBulkInsertSerializer,
)


class CommitViewSet(viewsets.ModelViewSet):
    serializer_class = CommitSerializer

    def get_queryset(self):
        # This view should return only commits from repositories owned by the authenticated user
        user = self.request.user
        queryset = Commit.objects.filter(repository__owner=user)
        # Filter against specific query parameters
        params = self.request.query_params
        repository = params.get('repository', None)
        if repository:
            queryset = queryset.filter(repository__id=repository)
        return queryset


class RepositoryViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # This view should return only repositories from the authenticated user
        user = self.request.user
        return Repository.objects.filter(owner=user)

    def get_serializer_class(self):
        if self.action == 'bulk_insert_commits':
            return RepositoryCommitsBulkInsertSerializer
        return RepositorySerializer

    def _get_past_month_commits(self, data):
        user = self.request.user
        repo = self.get_object()

        params = {}
        since = datetime.datetime.utcnow() - datetime.timedelta(days=data['days'])
        params['since'] = since.isoformat()

        credentials = user.github_credentials()
        token = credentials.extra_data['access_token']
        # repo.name already contains {user_name}/{project_name}
        endpoint = f'repos/{repo.name}/commits'
        req = github_request(endpoint, 'get', token, params)
        # If the response is anything different from OK, return an empty array
        if req.status_code != 200:
            return []
        return req.json()

    @action(detail=True, methods=['post'], url_path='repository-commits')
    def bulk_insert_commits(self, request, pk=None):
        repo = self.get_object()

        # Validates the POST data (basically only the number of
        # days we are going backwards to get commits from)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        past_month_commits = self._get_past_month_commits(serializer.data)
        # List of commits that were inserted in this request
        return save_multiple_commits(past_month_commits, repo.pk, bulk_insert_commit_parser)

    @action(
        detail=False, methods=['post'],
        permission_classes=[AllowAny],
        url_name='github-repo-webhook'
    )
    def webhook(self, request):
        data = request.data
        try:
            repo = data['repository']
            repo_name = repo['full_name']
            commits = data['commits']
        except KeyError:
            raise ParseError()
        repo = get_object_or_404(Repository, name=repo_name)
        return save_multiple_commits(commits, repo.pk, webhook_commit_parser)

    def create(self, request, *args, **kwargs):
        try:
            # Checks if the repository already exists in the database,
            # if it does, returns it instead of trying to create a duplicate
            repo_name = request.data['name']
            repo = Repository.objects.get(name=repo_name, owner=request.user)
            serializer = self.get_serializer(repo)
            # Returns an HTTP 200 response containing the data of the retrieved repository
            return Response(serializer.data)
        except (Repository.DoesNotExist, KeyError):
            # KeyError can be thrown if request.data['name'] is not set,
            # we allow it to pass through because it will be validated
            # by the serializer in the super-class method implementation
            pass
        # Adds the user to the data being saved as the repository owner
        request.data['owner'] = request.user.pk
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        super().perform_create(serializer)
        # After creating a repository, we must setup a webhook to "listen to" new data
        self._setup_webhook(serializer.data)

    def perform_update(self, serializer):
        super().perform_update(serializer)
        # After updating a repository, we must setup a webhook to "listen to" new data
        self._setup_webhook(serializer.data)

    def _setup_webhook(self, repository_data):
        repo_id = repository_data['id']
        owner_id = repository_data['owner']

        repo = Repository.objects.get(id=repo_id)
        owner = get_user_model().objects.get(id=owner_id)

        credentials = owner.github_credentials()
        if credentials:
            token = credentials.extra_data['access_token']
            webhook_url = self.reverse_action(self.webhook.url_name)
            repo.add_webhook(token, webhook_url)
