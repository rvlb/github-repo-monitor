from rest_framework import serializers

from .models import Commit, Repository

class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = ['code', 'message', 'repository', 'author']

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['name', 'owner']