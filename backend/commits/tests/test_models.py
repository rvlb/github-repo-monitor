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
