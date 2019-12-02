from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIRequestFactory, APIClient
from social_django.models import UserSocialAuth


def create_github_credentials(user, uid, login, token):
    UserSocialAuth.objects.create(
        user=user,
        provider='github',
        uid=uid,
        extra_data={'login': login, 'access_token': token}
    )


class BaseTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        # Create some test users
        foo_user = get_user_model().objects.create_user(email='test1@foo.com', password='12345')
        create_github_credentials(foo_user, '47837494', 'foo-user', '97249hsgfihfd824y')
        bar_user = get_user_model().objects.create_user(email='test2@bar.co.uk', password='67890')
        # Make data available to the test function
        self.foo_user = foo_user
        self.bar_user = bar_user
