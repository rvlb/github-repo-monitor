from commits.tests import BaseTestCase
from commits.utils import get_user_credentials


class UtilsTestCase(BaseTestCase):
    # get_user_credentials test cases
    def test_get_credentials_no_user(self):
        credentials = get_user_credentials(None)
        self.assertIsNone(credentials)

    def test_get_credentials_user_without_credentials(self):
        credentials = get_user_credentials(self.bar_user)  # has no credentials
        self.assertIsNone(credentials)

    def test_get_credentials(self):
        credentials = get_user_credentials(self.foo_user)
        self.assertIsNotNone(credentials)
