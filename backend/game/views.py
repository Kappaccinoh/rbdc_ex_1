from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress, UserAchievement, User, Streak
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer, UserAchievementSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login
import uuid
from django.db.models import Avg
from rest_framework.exceptions import PermissionDenied

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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Progress.objects.none()  # Return empty queryset for unauthenticated users
        return Progress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            raise PermissionDenied("Must be authenticated to create progress")

@api_view(['GET'])
def get_achievements(request):
    try:
        # Get all achievements
        achievements = Achievement.objects.all()
        
        # Group achievements by category
        achievements_by_category = {}
        
        for achievement in achievements:
            category = achievement.get_category_display()
            if category not in achievements_by_category:
                achievements_by_category[category] = {
                    'id': len(achievements_by_category) + 1,
                    'category': category,
                    'achievements': []
                }
            
            achievement_data = {
                'id': str(achievement.id),  # Add an ID for each achievement
                'title': achievement.title,
                'description': achievement.description,
                'progress': 0,
                'maxProgress': achievement.max_progress,
                'icon': achievement.icon,
                'unlocked': False
            }

            if request.user.is_authenticated:
                user_achievement = UserAchievement.objects.filter(
                    user=request.user,
                    achievement=achievement
                ).first()
                if user_achievement:
                    achievement_data.update({
                        'progress': user_achievement.progress,
                        'unlocked': user_achievement.unlocked
                    })
            
            achievements_by_category[category]['achievements'].append(achievement_data)
        
        result = list(achievements_by_category.values())
        print("API Response:", result)  # Debug print
        return Response(result)
        
    except Exception as e:
        print(f"Error in get_achievements: {str(e)}")
        return Response(
            {'error': 'Failed to fetch achievements'},
            status=500
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
def get_progress(request):
    if not request.user.is_authenticated:
        return Response({
            'averageWPM': 0,
            'averageAccuracy': 0,
            'levelsCompleted': 0,
            'totalLevels': Level.objects.count(),
            'recentActivity': []
        })
    
    user = request.user
    progress_data = Progress.objects.filter(user=user).order_by('-created_at')
    recent_activity = []
    
    for progress in progress_data[:5]:
        recent_activity.append({
            'levelName': progress.level.name,
            'date': progress.created_at.strftime("%Y-%m-%d %H:%M"),
            'wpm': progress.score,
            'accuracy': progress.accuracy
        })

    stats = {
        'averageWPM': progress_data.aggregate(Avg('score'))['score__avg'] or 0,
        'averageAccuracy': progress_data.aggregate(Avg('accuracy'))['accuracy__avg'] or 0,
        'levelsCompleted': progress_data.filter(completed=True).count(),
        'totalLevels': Level.objects.count(),
        'recentActivity': recent_activity
    }

    return Response(stats)

@api_view(['GET'])
def get_profile(request):
    if not request.user.is_authenticated:
        return Response({
            'username': 'Guest',
            'is_guest': True,
            'current_streak': 0,
            'member_since': None,
            'email': None,
        })
    
    user = request.user
    streak = Streak.objects.filter(user=user).first()
    current_streak = streak.current_streak if streak else 0
    
    profile_data = {
        'username': user.username,
        'is_guest': user.is_guest,
        'current_streak': current_streak,
        'member_since': user.created_at.strftime("%Y-%m-%d"),
        'email': user.email if not user.is_guest else None,
    }
    
    return Response(profile_data)
