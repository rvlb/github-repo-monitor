from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

class Repository(models.Model):
    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Repositório'
        verbose_name_plural = 'Repositórios'

    def __str__(self):
        return self.name

class Commit(models.Model):
    code = models.CharField(max_length=255, unique=True)
    url = models.URLField(max_length=255, default='')
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    def __str__(self):
        return self.code