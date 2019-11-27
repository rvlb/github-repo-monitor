import datetime

from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import (
    CommitSerializer,
    RepositorySerializer,
    RepositoryCommitsBulkInsertSerializer,
)
from .utils import get_user_credentials, github_request, add_webhook_to_repository


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

    @action(
        detail=False, methods=['post'],
        permission_classes=[AllowAny],
        url_name='github-repo-webhook'
    )
    def webhook(self, request):
        # TODO: implement
        return Response()

    def _get_past_month_commits(self, data):
        user = self.request.user
        repo = self.get_object()

        params = {}
        since = datetime.datetime.utcnow() - datetime.timedelta(days=data['days'])
        params['since'] = since.isoformat()

        credentials = get_user_credentials(user)
        token = credentials.extra_data['access_token']
        # repo.name already contains {user_name}/{repo_name}
        endpoint = f'repos/{repo.name}/commits'
        return github_request(endpoint, 'get', token, params).json()

    @action(detail=True, methods=['post'], url_path='repository-commits')
    def bulk_insert_commits(self, request, pk=None):
        repo = self.get_object()

        # Validates the POST data (basically only the number of
        # days we are going backwards to get commits from)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        past_month_commits = self._get_past_month_commits(serializer.data)
        # List of commits that were inserted in this request
        new_commits = []

        for raw_commit in past_month_commits:
            # Python 3.7 can't parse UTC's offset Z at the end of the string,
            # so we manually replace it with the numerical offset +00:00
            created_at = raw_commit['commit']['author']['date'].replace('Z', '+00:00')
            commit = {
                'code': raw_commit['sha'],
                'url': raw_commit['html_url'],
                'repository_id': repo.pk,
                'message': raw_commit['commit']['message'],
                'date': datetime.datetime.fromisoformat(created_at),
            }
            serializer = CommitSerializer(data=commit)
            serializer.is_valid()
            # Simply don't add commits that are already present in the database
            if serializer.validated_data:
                instance = serializer.save()
                new_commits.append(instance)

        serializer = CommitSerializer(new_commits, many=True)
        status_code = status.HTTP_201_CREATED
        # If no commits were added in this request, we return a
        # more proper status code instead of 201
        if not new_commits:
            status_code = status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

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

        owner = get_user_model().objects.get(id=owner_id)
        credentials = get_user_credentials(owner)
        if not credentials:
            return None
        token = credentials.extra_data['access_token']

        webhook_url = self.reverse_action(self.webhook.url_name)

        return add_webhook_to_repository(repo_id, token, webhook_url)
