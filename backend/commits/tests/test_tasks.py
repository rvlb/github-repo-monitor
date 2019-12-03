from django.test import TestCase

from commits.tasks import setup_webhook


class WebhookTaskTestCase(TestCase):
    def test_setup_webhook_no_repository(self):
        result = setup_webhook.delay(-1, 'https://hub.test.com/hwjrwr427')
        self.assertTrue(result.successful())
        self.assertFalse(result.get())
