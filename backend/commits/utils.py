import requests
from django.conf import settings


def get_user_credentials(user):
    if user is None:
        return None
    return user.social_auth.get(provider='github')


def github_request(endpoint, method, token, data):
    http_method = method.lower()
    api_root = settings.GITHUB_API_ROOT
    url = f'{api_root}/{endpoint}'
    headers = {'authorization': f'token {token}'}
    if http_method == 'get':
        return requests.get(url, params=data, headers=headers)
    if http_method == 'post':
        return requests.post(url, json=data, headers=headers)
    raise Exception('Não foi possível identificar o método HTTP.')


def is_repository_owner(credentials, repository_name):
    if credentials is None:
        return False
    # Validates that the GitHub user owns the repository
    github_user = credentials.extra_data['login']
    if f'{github_user}/' not in repository_name:
        return False
    return True


def validate_repository(repo_owner, repo_name, credentials):
    endpoint = f'repos/{repo_owner}/{repo_name}'
    token = credentials.extra_data['access_token']
    req = github_request(endpoint, 'get', token, {})
    if req.status_code == 200:
        return True
    return False
