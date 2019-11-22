import requests

from django.conf import settings
from django.http.response import HttpResponseNotFound, HttpResponseForbidden

from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer
from .utils import get_user_credentials

GITHUB_API_ROOT = settings.GITHUB_API_ROOT

class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer
    # TODO: write a method to retrieve all the past
    # month commits of a given repository and insert
    # then in the database if the don't already exist

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def _is_repository_owner(self, credentials, repository_name):
        if credentials is None:
            return False
        # Validates that the GitHub user owns the repository
        github_user = credentials.extra_data['login']
        if f'{github_user}/' not in repository_name:
            return False
        return True

    def _validate_repository(self, repo_owner, repo_name, credentials):
        endpoint = f'{GITHUB_API_ROOT}/repos/{repo_owner}/{repo_name}'
        token = credentials.extra_data['access_token']
        req = requests.get(endpoint, headers={'authorization': f'token {token}'})
        if req.status_code == 200:
            return True
        return False

    def _setup_webhook(self, repo_owner, repo_name, credentials):
        endpoint = f'{GITHUB_API_ROOT}/repos/{repo_owner}/{repo_name}/hooks'
        token = credentials.extra_data['access_token']
        server_base_url = 'http://localhost:8000' # TODO: get the correct base url
        webhook_data = {
            'config': {
                'url': f'{server_base_url}/api/repositories/webhook', # TODO: setup the webhook endpoint
                'content_type': 'json'
            }
        }
        requests.post(endpoint, data=webhook_data, headers={'authorization': f'token {token}'})

    def create(self, request, *args, **kwargs):
        # Adds the user to the data being saved as the repository owner
        request.data['owner'] = request.user.pk
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

        # After creating a repository, we must setup a webhook to "listen to" new data
        self._setup_webhook(repo_owner, repo_name, credentials)