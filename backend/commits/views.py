from django.http.response import HttpResponseBadRequest, HttpResponseForbidden

from rest_framework import viewsets, status
from rest_framework.response import Response

from common.utils.mixins import MixedPermissionsMixin

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer
from .utils import get_user_credentials

class CommitViewSet(viewsets.ModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    def create(self, request, *args, **kwargs):
        user = request.user
        credentials = get_user_credentials(user)
        if credentials is None:
            return HttpResponseForbidden()
        if 'name' in request.data:
            repository_data = request.data['name']
            try:
                repository_owner = repository_data.split('/')[0]
            except:
                return HttpResponseBadRequest('O nome do repositório informado é inválido.')
            login = credentials.extra_data['login']
            if repository_owner != login:
                return HttpResponseForbidden()
            # Injects the authenticated user as the repository owner
            request.data['owner'] = user.pk
            # After validating this data, we must check if the repository really exists
            # so we fetch this data via GitHub REST API
        return super().create(request, *args, **kwargs)
