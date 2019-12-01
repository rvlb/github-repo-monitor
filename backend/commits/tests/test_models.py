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
        added = repo.add_webhook('649242044984', 'https://webhook.com')
        self.assertTrue(added)
        self.assertTrue(repo.has_webhook, 'Um webhook deveria ter sido criado para o repositório.')
        self.assertEqual(repo.webhook_id, 123)

    def test_add_webhook_when_it_already_exists(self):
        repo = self.test_repo
        repo.webhook_id = 123
        repo.save()

        added = repo.add_webhook('649242044984', 'https://webhook.com')
        self.assertFalse(added)
        self.assertTrue(repo.has_webhook, 'O repositório deveria continuar com um webhook.')

    @mock.patch('common.utils.requests.delete')
    def test_delete_webhook(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_204_NO_CONTENT

        repo = self.test_repo
        repo.webhook_id = 123
        repo.save()
        self.assertTrue(repo.has_webhook)

        deleted = repo.delete_webhook('649242044984')
        self.assertTrue(deleted)
        self.assertFalse(repo.has_webhook, 'O repositório não deveria ter mais um webhook')
        self.assertIsNone(repo.webhook_id)

    def test_delete_webhook_when_it_didnt_exists(self):
        repo = self.test_repo

        deleted = repo.delete_webhook('649242044984')
        self.assertFalse(deleted)
        self.assertFalse(repo.has_webhook, 'O repositório deveria continuar sem um webhook.')


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
