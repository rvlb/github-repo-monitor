from django.shortcuts import reverse
from rest_framework import status
from common.tests.test_base import BaseTestCase


class HomeViewTestCase(BaseTestCase):
    endpoint = reverse('home')

    def test_home_view_renders_when_authenticated(self):
        client = self.client
        client.login(email=self.foo_user.email, password='12345')
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LoginViewTestCase(BaseTestCase):
    endpoint = reverse('login')

    def test_login_view_renders_not_authenticated(self):
        client = self.client
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_view_redirects_to_home_if_authenticated(self):
        client = self.client
        client.login(email=self.foo_user.email, password='12345')
        response = client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
