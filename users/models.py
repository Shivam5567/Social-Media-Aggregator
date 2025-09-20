from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    # Link this profile to a specific user. If the user is deleted, the profile is also deleted.
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Add extra user information
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    # A user can follow many other users, and can be followed by many users
    followers = models.ManyToManyField(User, related_name='following', blank=True)

    def __str__(self):
        return self.user.username