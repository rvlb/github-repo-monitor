import requests

from django.conf import settings


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
