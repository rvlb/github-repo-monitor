from unittest import mock

from django.shortcuts import reverse
from rest_framework import status
from common.tests.test_base import BaseTestCase


class UserGitHubDataTestCase(BaseTestCase):
    endpoint = reverse('github-data')

    def test_no_credentials_user_returns_404(self):
        client = self.client
        client.force_authenticate(user=self.bar_user)
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @mock.patch('common.utils.requests.get')
    def test_user_github_data_external_api_error(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        client = self.client
        client.force_authenticate(user=self.foo_user)
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @mock.patch('common.utils.requests.get')
    def test_user_github_data(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_200_OK
        mock_github.return_value.json.return_value = {
            'avatar_url': 'https://api.github.com/foo.png',
            'login': 'foo-user'
        }

        client = self.client
        client.force_authenticate(user=self.foo_user)
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(set(data.keys()), set(['avatar', 'login']))
