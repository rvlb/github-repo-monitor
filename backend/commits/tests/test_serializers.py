from unittest import mock
from rest_framework import status

from commits.models import Repository, Commit
from commits.serializers import (
    RepositorySerializer,
    CommitSerializer,
)

from common.tests.test_base import BaseTestCase


class BaseSerializerTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        # Create the request object
        self.request = self.factory.get(f'/api/{self.api_endpoint}/', format='json')
        self.request.user = self.foo_user


class RepositorySerializerTestCase(BaseSerializerTestCase):
    serializer = RepositorySerializer
    api_endpoint = '/repositories'

    def test_contains_expected_fields(self):
        repo = Repository.objects.create(name='foo-user/test-repo', owner=self.foo_user)
        serializer = self.serializer(instance=repo)
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

    @mock.patch('common.utils.requests.get')
    def test_repository_doesnt_exist(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_404_NOT_FOUND

        data = {'owner': self.foo_user.pk, 'name': 'foo-user/valid-name'}
        serializer = self.serializer(data=data, context={'request': self.request})
        is_valid = serializer.is_valid()
        self.assertFalse(is_valid, 'O repositório existe.')

    @mock.patch('common.utils.requests.get')
    def test_repository_is_valid(self, mock_github):
        # Mocks the response of the GitHub request
        mock_github.return_value.status_code = status.HTTP_200_OK

        data = {'owner': self.foo_user.pk, 'name': 'foo-user/valid-name'}
        serializer = self.serializer(data=data, context={'request': self.request})
        is_valid = serializer.is_valid(raise_exception=True)
        self.assertTrue(is_valid, 'O repositório não é válido.')


class CommitSerializerTestCase(BaseSerializerTestCase):
    serializer = CommitSerializer
    api_endpoint = '/commits'

    def test_contains_expected_fields(self):
        repo = Repository.objects.create(name='foo-user/test-repo', owner=self.foo_user)
        commit = Commit.objects.create(
            code='468427924',
            url='http://github.com/foo-user/test-repo/468427924',
            message='All your bases are belong to us',
            date='1995-02-10 13:46:00-03:00',
            repository=repo,
        )
        serializer = self.serializer(instance=commit)
        data = serializer.data
        self.assertEqual(
            set(data.keys()),
            set(['code', 'message', 'repository', 'url', 'id', 'date'])
        )
