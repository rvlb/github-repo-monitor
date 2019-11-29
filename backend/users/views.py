from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from common.utils import github_request
from .serializers import GitHubUserSerializer


@api_view()
def auth_user_github_data(request, *args, **kwargs):
    credentials = request.user.github_credentials()
    if credentials:
        token = credentials.extra_data['access_token']
        req = github_request('user', 'get', token, {})
        if req.status_code == 200:
            github_data = req.json()
            data = {'avatar': github_data['avatar_url'], 'login': github_data['login']}
            serializer = GitHubUserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            return Response(data=serializer.data)
    raise NotFound(detail='O usuário não possui credenciais do GitHub.')
