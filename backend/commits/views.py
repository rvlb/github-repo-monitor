import requests
import datetime

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http.response import HttpResponseNotFound, HttpResponseForbidden

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer
from .utils import get_user_credentials

GITHUB_API_ROOT = settings.GITHUB_API_ROOT

class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def _github_request(self, endpoint, method, token, data={}):
        http_method = method.lower()
        url = f'{GITHUB_API_ROOT}/{endpoint}'
        headers = {'authorization': f'token {token}'}
        if http_method == 'get':
            return requests.get(url, params=data, headers=headers)
        elif http_method == 'post':
            return requests.post(url, json=data, headers=headers)
        return

    def _is_repository_owner(self, credentials, repository_name):
        if credentials is None:
            return False
        # Validates that the GitHub user owns the repository
        github_user = credentials.extra_data['login']
        if f'{github_user}/' not in repository_name:
            return False
        return True

    def _validate_repository(self, repo_owner, repo_name, credentials):
        endpoint = f'repos/{repo_owner}/{repo_name}'
        token = credentials.extra_data['access_token']
        req = self._github_request(endpoint, 'get', token)
        if req.status_code == 200:
            return True
        return False

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
        return self._github_request(endpoint, 'post', token, webhook_data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_name='github-repo-webhook')
    def webhook(self, request):
        # TODO: implement
        return Response()
    
    @action(detail=True, methods=['post'], url_path='past-month-commits')
    def bulk_insert_past_month_commits(self, request, pk=None):
        repo = self.get_object()

        credentials = get_user_credentials(request.user)
        token = credentials.extra_data['access_token']

        # repo.name already contains {user_name}/{repo_name}
        endpoint = f'repos/{repo.name}/commits'

        one_month_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        params = {'since': one_month_ago.isoformat()}

        new_commits = [] # List of commits that were inserted in this request
        past_month_commits = self._github_request(endpoint, 'get', token, params).json()
        for raw_commit in past_month_commits:
            # Python 3.7 can't parse UTC's offset Z at the end of the string,
            # so we manually replace it with the numerical offset +00:00
            created_at = raw_commit['commit']['author']['date'].replace('Z', '+00:00')
            commit = {
                'code': raw_commit['sha'],
                'url': raw_commit['url'], # The API endpoint that returns this commit
                'repository': repo.pk,
                'message': raw_commit['commit']['message'],
                'created_at': datetime.datetime.fromisoformat(created_at),
            }
            serializer = CommitSerializer(data=commit)
            if serializer.is_valid():
                instance = serializer.save()
                new_commits.append(instance)
        
        serializer = CommitSerializer(new_commits, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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
        user = self.request.user
        data = self.request.data

        credentials = get_user_credentials(user)
        is_owner = self._is_repository_owner(credentials, data['name'])
        if not is_owner:
            return HttpResponseForbidden('Você não tem permissão para acessar este repositório.')

        [repo_owner, repo_name] = data['name'].split('/')
        repository_exists = self._validate_repository(repo_owner, repo_name, credentials)
        if not repository_exists:
            return HttpResponseNotFound('O repositório informado não existe.')
        
        serializer.save()

        # GitHub webhook API won't work with localhost, so we don't call it in development mode
        if not settings.DEBUG:
            # After creating a repository, we must setup a webhook to "listen to" new data
            self._setup_webhook(repo_owner, repo_name, credentials)
