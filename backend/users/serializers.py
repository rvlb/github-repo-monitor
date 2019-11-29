from rest_framework import serializers


class GitHubUserSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)
    avatar = serializers.URLField(required=True)
