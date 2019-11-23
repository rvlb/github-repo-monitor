from rest_framework import serializers

from .models import Commit, Repository

class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = ['code', 'message', 'repository', 'url', 'id', 'created_at']

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['name', 'owner', 'id']
    
    def validate_name(self, value):
        # Checks if the repository name is well-formed
        repository_data = list(filter(None, value.split('/')))
        if len(repository_data) != 2:
            raise serializers.ValidationError('O nome do repositório informado é inválido.')
        return value