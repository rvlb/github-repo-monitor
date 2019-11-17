from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import UserSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False)
    def logged_user(self, request):
        user = request.user
        print(user.social_auth.get(provider='github').extra_data['access_token'])
        serializer = self.get_serializer(user)
        return Response(serializer.data)
