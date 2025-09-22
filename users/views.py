# users/views.py

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer, ProfileSerializer
from .permissions import IsOwnerOrReadOnly

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class FollowToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user__username):
        profile_to_follow = generics.get_object_or_404(Profile, user__username=user__username)
        user = request.user

        if profile_to_follow.followers.filter(pk=user.pk).exists():
            profile_to_follow.followers.remove(user)
        else:
            profile_to_follow.followers.add(user)
        
        return Response({'status': 'ok'})