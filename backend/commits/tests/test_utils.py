from rest_framework import status
from common.tests.test_base import BaseTestCase
from commits.models import Repository, Commit
from commits.utils import (
    save_multiple_commits,
    webhook_commit_parser,
    bulk_insert_commit_parser
)


class UtilsTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        repo = Repository.objects.create(name='foo-user/repo', owner=self.foo_user)
        self.repository_id = repo.pk

    def test_webhook_commit_parser(self):
        commit = {
            'id': '387393',
            'url': 'https://www.foo.com',
            'timestamp': '2019-02-10 00:00:00Z',
            'message': 'Hello World'
        }
        parsed_commit = webhook_commit_parser(commit)
        self.assertEqual(set(parsed_commit.keys()), set(['code', 'url', 'date', 'message']))

    def test_webhook_commit_parser_error(self):
        commit = {
            'id': '387393',
        }
        parsed_commit = webhook_commit_parser(commit)
        self.assertIsNone(parsed_commit)

    def test_bulk_insert_commit_parser(self):
        commit = {
            'sha': '387393',
            'html_url': 'https://www.foo.com',
            'commit': {
                'message': 'Hello World',
                'author': {
                    'date': '2019-02-10 00:00:00Z'
                }
            }
        }
        parsed_commit = bulk_insert_commit_parser(commit)
        self.assertEqual(set(parsed_commit.keys()), set(['code', 'url', 'date', 'message']))

    def test_bulk_insert_commit_parser_error(self):
        commit = {
            'sha': '387393',
        }
        parsed_commit = bulk_insert_commit_parser(commit)
        self.assertIsNone(parsed_commit)

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

    def test_save_multiple_skips_invalid_commits(self):
        commits = [
            {
                'id': '387393',
                'url': 'https://www.foo.com',
                'timestamp': '2019-02-10 00:00:00Z',
                'message': 'Hello World'
            },
            {'id': '70385353058'}
        ]
        new_commits = save_multiple_commits(commits, self.repository_id, webhook_commit_parser)
        # The second commit should fail the parsing, so just one commit should be created
        self.assertEqual(len(new_commits.data), 1)

    def test_save_multiple_skips_existent_commits(self):
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
