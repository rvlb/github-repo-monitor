from celery import shared_task
from .models import Repository


@shared_task
def setup_webhook(repository_id, webhook_url):
    try:
        repo = Repository.objects.get(id=repository_id)
        repo.add_webhook(webhook_url)
    except Repository.DoesNotExist:
        pass
