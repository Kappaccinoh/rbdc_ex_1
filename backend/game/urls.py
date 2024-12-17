from django.urls import path
from game.views import LevelListView

urlpatterns = [
    path('levels/', LevelListView.as_view(), name='level-list'),
]
