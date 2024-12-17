from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress, UserAchievement, User, Streak
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout, authenticate
from django.db.models import Avg

# List all Levels
class LevelListView(generics.ListAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def get_achievements(request):
    try:
        achievements = Achievement.objects.all()
        achievements_by_category = {}
        
        for achievement in achievements:
            category = achievement.get_category_display()
            if category not in achievements_by_category:
                achievements_by_category[category] = {
                    'id': len(achievements_by_category) + 1,
                    'category': category,
                    'achievements': []
                }
            
            achievements_by_category[category]['achievements'].append({
                'title': achievement.title,
                'description': achievement.description,
                'progress': 0,
                'maxProgress': achievement.max_progress,
                'icon': achievement.icon,
                'unlocked': False
            })
        
        return Response(list(achievements_by_category.values()))
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch achievements'},
            status=500
        )

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
    
    return Response({
        'username': user.username,
        'is_guest': user.is_guest,
        'current_streak': current_streak,
        'member_since': user.created_at.strftime("%Y-%m-%d"),
        'email': user.email if not user.is_guest else None,
    })

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
