from common.tests.test_base import BaseTestCase


class UserModelTestCase(BaseTestCase):
    def test_full_name_is_equal_to_email(self):
        user = self.foo_user
        self.assertEqual(user.get_full_name(), user.email)

    def test_short_name_is_equal_to_email(self):
        user = self.foo_user
        self.assertEqual(user.get_short_name(), user.email)

    def test_str_is_equal_to_email(self):
        user = self.foo_user
        self.assertEqual(str(user), user.email)

    def test_github_credentials_without_credentials(self):
        user = self.bar_user
        self.assertIsNone(user.github_credentials())

    def test_is_repository_owner_without_credentials(self):
        user = self.bar_user
        self.assertFalse(user.is_repository_owner('bar-user/no-credentials'))
