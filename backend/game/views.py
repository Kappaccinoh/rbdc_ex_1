from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress, UserAchievement, User
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer, UserAchievementSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login
import uuid
from django.db.models import Avg

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

@api_view(['POST'])
def create_guest_session(request):
    try:
        # Create a guest user
        username = f'guest_{uuid.uuid4().hex[:8]}'
        user = User.objects.create(
            username=username,
            is_guest=True,
        )
        
        # Log the user in
        login(request, user)
        
        return Response({
            'guest_token': str(user.guest_token),
            'message': 'Guest session created successfully'
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )

# Update the progress view to handle guest users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress(request):
    user = request.user
    
    # Get user's progress data
    progress_data = Progress.objects.filter(user=user).order_by('-created_at')
    recent_activity = []
    
    for progress in progress_data[:5]:  # Last 5 activities
        recent_activity.append({
            'levelName': progress.level.name,
            'date': progress.created_at.strftime("%Y-%m-%d %H:%M"),
            'wpm': progress.score,  # Assuming score represents WPM
            'accuracy': progress.accuracy if hasattr(progress, 'accuracy') else 0
        })

    # Calculate stats
    stats = {
        'averageWPM': progress_data.aggregate(Avg('score'))['score__avg'] or 0,
        'averageAccuracy': progress_data.aggregate(Avg('accuracy'))['accuracy__avg'] or 0,
        'levelsCompleted': progress_data.filter(completed=True).count(),
        'totalLevels': Level.objects.count(),
        'recentActivity': recent_activity
    }

    return Response(stats)
