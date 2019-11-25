from rest_framework import serializers

from .models import Commit, Repository
from .utils import get_user_credentials, is_repository_owner, validate_repository

class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = ['code', 'message', 'repository', 'url', 'id', 'date']
        depth = 1

class RepositoryCommitsBulkInsertSerializer(serializers.Serializer):
    days = serializers.IntegerField(min_value=0, default=0)

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['name', 'owner', 'id']
    
    def validate_name(self, value):
        # Checks if the repository name is well-formed
        repository_data = list(filter(None, value.split('/')))
        if len(repository_data) != 2:
            raise serializers.ValidationError('O nome do repositório informado é inválido.')
        # Validates that the authenticated user owns the repository
        user = self.context.get('request').user
        credentials = get_user_credentials(user)
        is_owner = is_repository_owner(credentials, value)
        if not is_owner:
            raise serializers.ValidationError('Você não tem permissão para acessar este repositório.')
        # Validates that the repository actually exists
        [repo_owner, repo_name] = value.split('/')
        repository_exists = validate_repository(repo_owner, repo_name, credentials)
        if not repository_exists:
            raise serializers.ValidationError('O repositório informado não existe.')
        return value