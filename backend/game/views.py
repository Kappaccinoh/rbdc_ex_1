from rest_framework import generics, permissions
from rest_framework.response import Response
from game.models import Level, Achievement, Progress, UserAchievement, User, Streak
from game.serializers import LevelSerializer, AchievementSerializer, ProgressSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout, authenticate
from django.db.models import Avg

@api_view(['GET'])
@permission_classes([AllowAny])
def get_levels(request):
    try:
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Failed to fetch levels'}, status=500)

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
@permission_classes([AllowAny])
def get_profile(request):
    if not request.user.is_authenticated:
        return Response({'authenticated': False})
    
    user = request.user
    return Response({
        'authenticated': True,
        'username': user.username,
        'email': user.email,
        'is_guest': user.is_guest,
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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_level_by_id(request, level_id):
    try:
        level = Level.objects.get(id=level_id)
        serializer = LevelSerializer(level)
        return Response(serializer.data)
    except Level.DoesNotExist:
        return Response({'error': 'Level not found'}, status=404)
    except Exception as e:
        return Response({'error': 'Failed to fetch level'}, status=500)
