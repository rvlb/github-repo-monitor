from rest_framework import status
from common.tests.test_base import BaseTestCase
from commits.models import Repository, Commit
from commits.utils import save_multiple_commits


class UtilsTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        repo = Repository.objects.create(name='foo-user/repo', owner=self.foo_user)
        self.repository_id = repo.pk

    def test_save_multiple_new_commits(self):
        commits = [
            {
                'code': '387393',
                'url': 'https://www.foo.com',
                'date': '2019-02-10 00:00:00Z',
                'message': 'Hello World'
            },
            {
                'code': '920845',
                'url': 'https://www.bar.com',
                'date': '2018-02-10 00:00:00Z',
                'message': 'Bye World'
            },
        ]
        new_commits = save_multiple_commits(commits, self.repository_id, (lambda x: x))
        self.assertEqual(len(new_commits.data), 2)
        self.assertEqual(new_commits.status_code, status.HTTP_201_CREATED)

    def test_save_multiple_pre_existent_commits(self):
        repo = Repository.objects.get(id=self.repository_id)
        commits = [
            {
                'code': '387393',
                'url': 'https://www.foo.com',
                'date': '2019-02-10 00:00:00Z',
                'message': 'Hello World'
            },
            {
                'code': '920845',
                'url': 'https://www.bar.com',
                'date': '2018-02-10 00:00:00Z',
                'message': 'Bye World'
            },
        ]
        Commit.objects.create(**commits[0], repository=repo)

        new_commits = save_multiple_commits(commits, self.repository_id, (lambda x: x))
        self.assertEqual(len(new_commits.data), 1, 'Apenas um commit novo deveria ter sido criado')
        self.assertEqual(new_commits.status_code, status.HTTP_201_CREATED)

        new_commits = save_multiple_commits(commits, self.repository_id, (lambda x: x))
        self.assertEqual(len(new_commits.data), 0, 'Nenhum commit novo deveria ter sido criado')
        self.assertEqual(new_commits.status_code, status.HTTP_200_OK)
