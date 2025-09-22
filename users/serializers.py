# users/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from posts.serializers import PostSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    posts = PostSerializer(source='user.posts', many=True, read_only=True)
    username = serializers.CharField(source='user.username')
    user_id = serializers.ReadOnlyField(source='user.id')
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 
            'user_id', 
            'username', 
            'bio', 
            'profile_picture', 
            'posts', 
            'followers_count', 
            'following_count', 
            'is_following'
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.user.following.count()

    def get_is_following(self, obj):
        # We need to check if self.context has a 'request' key
        request = self.context.get('request', None)
        if request is None or not request.user.is_authenticated:
            return False
        user = request.user
        return obj.followers.filter(pk=user.pk).exists()