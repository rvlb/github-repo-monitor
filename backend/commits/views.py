import requests
from django.http.response import HttpResponseNotFound, HttpResponseForbidden

from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer
from .utils import get_user_credentials

class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

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
        endpoint = f'https://api.github.com/repos/{repo_owner}/{repo_name}'
        token = credentials.extra_data['access_token']
        req = requests.get(endpoint, headers={'authorization': f'token {token}'})
        if req.status_code == 200:
            return True
        return False

    def create(self, request, *args, **kwargs):
        # Adds the user to the data being saved as the repository owner
        request.data['owner'] = request.user.pk
        return super().create(request, *args, **kwargs)
        # TODO: fetch all the commits that should be added and insert
        # them in the database after creating the repository
    
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
