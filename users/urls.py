from django.urls import path
from .views import UserCreate, ProfileDetailView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='user-register'),

    path('profiles/<str:user__username>/', ProfileDetailView.as_view(), name='profile-detail'),
]