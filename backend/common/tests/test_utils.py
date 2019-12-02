from django.test import TestCase
from common.utils import github_request


class UtilsTestCase(TestCase):
    def test_not_supported_method_raises_exception(self):
        with self.assertRaisesMessage(Exception, 'Não foi possível identificar o método HTTP.'):
            github_request('https://somestuff.com/api/', 'clearlywrong', '4yy9u40442e', {})
