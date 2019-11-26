from unittest import mock

from commits.tests import BaseTestCase
from commits.models import Repository
from commits.serializers import (
    RepositorySerializer,
)


class RepositorySerializerTestCase(BaseTestCase):
    serializer = RepositorySerializer

    def setUp(self):
        super().setUp()

        # Create some test repositories
        test_repo = Repository.objects.create(name='foo-user/test-repo', owner=self.foo_user)
        self.test_repo = test_repo

        self.request = self.factory.get('/api/repositories/', format='json')
        self.request.user = self.foo_user

    def test_contains_expected_fields(self):
        serializer = self.serializer(instance=self.test_repo)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'owner', 'name']))

    def test_repository_non_well_formed_name(self):
        for repo_name in ['', 'foo-user/', '/invalid-name', '/']:
            data = {'owner': self.foo_user.pk, f'name': repo_name}
            serializer = self.serializer(data=data, context={'request': self.request})
            is_valid = serializer.is_valid()
            self.assertFalse(is_valid, f'O repositório {repo_name} é válido.')

    def test_repository_no_access(self):
        for repo_name in ['bar-user/repo_test', 'baz-person/foo-person']:
            data = {'owner': self.foo_user.pk, f'name': repo_name}
            serializer = self.serializer(data=data, context={'request': self.request})
            is_valid = serializer.is_valid()
            self.assertFalse(is_valid, f'O usuário tem acesso ao repositório {repo_name}.')

    @mock.patch('commits.utils.requests.get')
    def test_repository_doesnt_exist(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = 404

        data = {'owner': self.foo_user.pk, 'name': 'foo-user/valid-name'}
        serializer = self.serializer(data=data, context={'request': self.request})
        is_valid = serializer.is_valid()
        self.assertFalse(is_valid, 'O repositório existe.')

    @mock.patch('commits.utils.requests.get')
    def test_repository_is_valid(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = 200

        data = {'owner': self.foo_user.pk, 'name': 'foo-user/valid-name'}
        serializer = self.serializer(data=data, context={'request': self.request})
        is_valid = serializer.is_valid(raise_exception=True)
        self.assertTrue(is_valid, 'O repositório não é válido.')
