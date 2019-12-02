from django.shortcuts import reverse
from common.tests.test_base import BaseTestCase

from commits.models import Repository, Commit


class ViewsBaseTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()

        first_repo = Repository.objects.create(name='foo-user/first-repo', owner=self.foo_user)
        second_repo = Repository.objects.create(name='foo-user/second-repo', owner=self.foo_user)
        not_foo_repo = Repository.objects.create(name='bar-user/not-foo-repo', owner=self.bar_user)

        self.first_repo = first_repo
        self.second_repo = second_repo
        self.not_foo_repo = not_foo_repo


class FetchRepositoriesTestCase(ViewsBaseTestCase):
    endpoint = reverse('Repository-list')

    def test_response_only_has_user_repositories(self):
        client = self.client
        client.force_authenticate(user=self.foo_user)
        response = client.get(self.endpoint)
        data = response.data
        self.assertEqual(data['count'], 2, 'Retorna apenas os repositórios de foo-user')


class FetchCommitsTestCase(ViewsBaseTestCase):
    endpoint = reverse('Commit-list')

    def setUp(self):
        super().setUp()

        Commit.objects.create(
            code='468427924',
            url='http://github.com/foo-user/first-repo/468427924',
            message='All your bases are belong to us',
            date='1995-02-10 13:46:00-03:00',
            repository=self.first_repo,
        )

        Commit.objects.create(
            code='4739844',
            url='http://github.com/foo-user/first-repo/4739844',
            message='The cake is a lie',
            date='1995-02-10 13:46:00-03:00',
            repository=self.first_repo,
        )

        Commit.objects.create(
            code='804353500',
            url='http://github.com/foo-user/first-repo/804353500',
            message='It is dangerous to go alone',
            date='1995-02-10 13:46:00-03:00',
            repository=self.first_repo,
        )

        Commit.objects.create(
            code='742867934',
            url='http://github.com/foo-user/second-repo/742867934',
            message='You are a wizard, Harry',
            date='1995-02-10 13:46:00-03:00',
            repository=self.second_repo,
        )

        Commit.objects.create(
            code='132442424',
            url='http://github.com/foo-user/second-repo/132442424',
            message='Hey Jude',
            date='1995-02-10 13:46:00-03:00',
            repository=self.second_repo,
        )

        Commit.objects.create(
            code='642742480',
            url='http://github.com/bar-user/not-foo-repo/642742480',
            message='Não é a mamãe',
            date='1995-02-10 13:46:00-03:00',
            repository=self.not_foo_repo,
        )

    def test_response_only_has_user_commits(self):
        client = self.client
        client.force_authenticate(user=self.foo_user)
        response = client.get(self.endpoint)
        data = response.data
        self.assertEqual(data['count'], 5, 'Retorna apenas os commits de foo-user')

    def test_response_only_has_repository_commits(self):
        client = self.client
        client.force_authenticate(user=self.foo_user)

        response = client.get(self.endpoint, {'repository': self.first_repo.pk})
        data = response.data
        self.assertEqual(data['count'], 3, 'Retorna apenas os commits de foo-user/first-repo')

        response = client.get(self.endpoint, {'repository': self.second_repo.pk})
        data = response.data
        self.assertEqual(data['count'], 2, 'Retorna apenas os commits de foo-user/second-repo')
