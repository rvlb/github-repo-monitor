import datetime

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer, RepositoryCommitsBulkInsertSerializer
from .utils import get_user_credentials, github_request

class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()

    def get_serializer_class(self):
        if self.action == 'bulk_insert_commits':
            return RepositoryCommitsBulkInsertSerializer
        return RepositorySerializer

    def _setup_webhook(self, repo_owner, repo_name, credentials):
        # TODO: migrate this to use celery
        endpoint = f'repos/{repo_owner}/{repo_name}/hooks'
        token = credentials.extra_data['access_token']
        webhook_data = {
            'config': {
                # Builds the url of the endpoint responsible for handling the webhook
                'url': self.reverse_action(self.webhook.url_name),
                'content_type': 'json'
            }
        }
        return github_request(endpoint, 'post', token, webhook_data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_name='github-repo-webhook')
    def webhook(self, request):
        # TODO: implement
        return Response()
    
    @action(detail=True, methods=['post'], url_path='repository-commits')
    def bulk_insert_commits(self, request, pk=None):
        repo = self.get_object()

        # Validates the POST data (basically only the number of
        # days we are going backwards to get commits from)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        params = {}
        days = serializer.data['days']
        since = datetime.datetime.utcnow() - datetime.timedelta(days=days)
        params['since'] = since.isoformat()

        new_commits = [] # List of commits that were inserted in this request

        credentials = get_user_credentials(request.user)
        token = credentials.extra_data['access_token']
        endpoint = f'repos/{repo.name}/commits' # repo.name already contains {user_name}/{repo_name}
        past_month_commits = github_request(endpoint, 'get', token, params).json()

        for raw_commit in past_month_commits:
            # Python 3.7 can't parse UTC's offset Z at the end of the string,
            # so we manually replace it with the numerical offset +00:00
            created_at = raw_commit['commit']['author']['date'].replace('Z', '+00:00')
            commit = {
                'code': raw_commit['sha'],
                'url': raw_commit['html_url'],
                'repository': repo.pk,
                'message': raw_commit['commit']['message'],
                'date': datetime.datetime.fromisoformat(created_at),
            }
            serializer = CommitSerializer(data=commit)
            if serializer.is_valid():
                instance = serializer.save()
                new_commits.append(instance)
        
        serializer = CommitSerializer(new_commits, many=True)
        status_code = status.HTTP_201_CREATED
        # If no commits were added in this request, we return a more proper status code instead of 201
        if len(new_commits) == 0:
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
        # GitHub webhook API won't work with localhost, so we don't call it in development mode
        if not settings.DEBUG:
            credentials = get_user_credentials(self.request.user)
            [repo_owner, repo_name] = self.request.data['name'].split('/')
            # After creating a repository, we must setup a webhook to "listen to" new data
            self._setup_webhook(repo_owner, repo_name, credentials)
