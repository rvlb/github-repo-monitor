import requests

from django.conf import settings
from django.shortcuts import get_object_or_404

from social_django.models import UserSocialAuth

from .models import Repository


def get_user_credentials(user):
    if user is None:
        return None
    try:
        return user.social_auth.get(provider='github')
    except UserSocialAuth.DoesNotExist:
        return None


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


def validate_repository(owner_name, project_name, credentials):
    endpoint = f'repos/{owner_name}/{project_name}'
    token = credentials.extra_data['access_token']
    req = github_request(endpoint, 'get', token, {})
    if req.status_code == 200:
        return True
    return False


def add_webhook_to_repository(repository_id, token, webhook_url):
    # TODO: migrate this to use celery
    repo = get_object_or_404(Repository, id=repository_id)
    if not repo.has_webhook():
        repo_name = repo.name
        webhook_data = {'config': {'url': webhook_url, 'content_type': 'json'}}
        # repo.name already contains {user_name}/{project_name}
        endpoint = f'repos/{repo_name}/hooks'
        req = github_request(endpoint, 'post', token, webhook_data)
        if req.status_code == 201:
            webhook = req.json()
            repo.webhook_id = webhook['id']
            repo.save()
