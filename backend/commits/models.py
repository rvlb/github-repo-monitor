from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


class Repository(models.Model):
    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    webhook_id = models.PositiveIntegerField(null=True)

    class Meta:
        verbose_name = 'Repositório'
        verbose_name_plural = 'Repositórios'

    def __str__(self):
        return self.name

    def has_webhook(self):
        return self.webhook_id is not None


class Commit(models.Model):
    code = models.CharField(max_length=255, unique=True)
    url = models.URLField(max_length=255, default='')
    message = models.CharField(max_length=255)
    date = models.DateTimeField(default=timezone.now)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.code
