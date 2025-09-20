from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    # author's username
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        #fields that  returned API response
        fields = ['id', 'author', 'author_username', 'image', 'caption', 'created_at']
        #'author' as read-only because we will set it automatically in the view
        read_only_fields = ['author']