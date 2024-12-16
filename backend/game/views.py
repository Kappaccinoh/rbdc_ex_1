from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer

# List all Levels
class LevelListView(generics.ListAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.AllowAny]  # Public access


# Get a specific Level
class LevelDetailView(generics.RetrieveAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.AllowAny]


# List all Achievements
class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.AllowAny]


# List or Create Progress for the logged-in user
class ProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return progress for the current user
        return Progress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user for the progress
        serializer.save(user=self.request.user)
