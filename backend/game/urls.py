from django.urls import path
from game.views import LevelListView, LevelDetailView, AchievementListView, ProgressListCreateView

urlpatterns = [
    path('levels/', LevelListView.as_view(), name='level-list'),
    path('levels/<uuid:pk>/', LevelDetailView.as_view(), name='level-detail'),
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
    path('progress/', ProgressListCreateView.as_view(), name='progress-list-create'),
]
