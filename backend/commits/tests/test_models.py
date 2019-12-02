from unittest import mock
from rest_framework import status
from commits.models import Repository, Commit

from common.tests.test_base import BaseTestCase


class RepositoryModelTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        test_repo = Repository.objects.create(name='foo-user/test-repo', owner=self.foo_user)
        self.test_repo = test_repo

    def test_str_is_equal_to_name(self):
        repo = self.test_repo
        self.assertEqual(str(repo), repo.name)

    @mock.patch('common.utils.requests.post')
    def test_add_webhook(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_201_CREATED
        mock_github.return_value.json.return_value = {
            'id': 123
        }

        repo = self.test_repo
        added = repo.add_webhook(self.foo_user.pk, 'https://webhook.com')
        self.assertTrue(added)
        self.assertTrue(repo.has_webhook, 'Um webhook deveria ter sido criado para o repositório.')
        self.assertEqual(repo.webhook_id, 123)

    def test_add_webhook_without_credentials(self):
        repo = self.test_repo
        added = repo.add_webhook(self.bar_user.pk, 'https://webhook.com')
        self.assertFalse(added)

    def test_add_webhook_when_it_already_exists(self):
        repo = self.test_repo
        repo.webhook_id = 123
        repo.save()

        added = repo.add_webhook(self.foo_user.pk, 'https://webhook.com')
        self.assertFalse(added)
        self.assertTrue(repo.has_webhook, 'O repositório deveria continuar com um webhook.')


class CommitModelTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        test_repo = Repository.objects.create(name='foo-user/test-repo', owner=self.foo_user)
        test_commit = Commit.objects.create(
            code='468427924',
            url='http://github.com/foo-user/test-repo/468427924',
            message='All your bases are belong to us',
            date='1995-02-10 13:46:00-03:00',
            repository=test_repo,
        )
        self.test_commit = test_commit

    def test_str_is_equal_to_code(self):
        commit = self.test_commit
        self.assertEqual(str(commit), commit.code)
