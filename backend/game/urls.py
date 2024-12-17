from django.urls import path
from game import views

urlpatterns = [
    path('levels/', views.get_levels, name='levels'),
    path('achievements/', views.get_achievements, name='achievements'),
    path('progress/', views.get_progress, name='progress'),
    path('profile/', views.get_profile, name='profile'),
]