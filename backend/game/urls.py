from django.urls import path
from game import views

urlpatterns = [
    path('levels/', views.get_levels, name='levels'),
    path('levels/<str:level_id>/', views.get_level_by_id, name='level-detail'),
    path('achievements/', views.get_achievements, name='achievements'),
    path('progress/', views.get_progress, name='progress'),
    path('profile/', views.get_profile, name='profile'),
]