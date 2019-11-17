from django.db import models
from django.contrib.auth import get_user_model

class Repository(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Commit(models.Model):
    code = models.CharField(max_length=255)
    message = models.CharField(max_length=255)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.code