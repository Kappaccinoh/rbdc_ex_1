from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress, UserAchievement
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer, UserAchievementSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_achievements(request):
    # Get all achievements for the user
    user_achievements = UserAchievement.objects.filter(user=request.user)
    
    # If user doesn't have achievements yet, create them
    if not user_achievements.exists():
        achievements = Achievement.objects.all()
        for achievement in achievements:
            UserAchievement.objects.create(
                user=request.user,
                achievement=achievement
            )
        user_achievements = UserAchievement.objects.filter(user=request.user)
    
    # Group achievements by category
    achievements_by_category = {}
    for user_achievement in user_achievements:
        category = user_achievement.achievement.get_category_display()
        if category not in achievements_by_category:
            achievements_by_category[category] = {
                'id': len(achievements_by_category) + 1,
                'category': category,
                'achievements': []
            }
        
        achievements_by_category[category]['achievements'].append({
            'title': user_achievement.achievement.title,
            'description': user_achievement.achievement.description,
            'progress': user_achievement.progress,
            'maxProgress': user_achievement.achievement.max_progress,
            'icon': user_achievement.achievement.icon,
            'unlocked': user_achievement.unlocked
        })
    
    return Response(list(achievements_by_category.values()))
