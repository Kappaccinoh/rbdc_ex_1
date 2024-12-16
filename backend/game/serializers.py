from rest_framework import serializers
from game.models import Level, Achievement, Progress, UserAchievement

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name', 'difficulty', 'challenge_text', 'created_at']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'category', 'icon', 'max_progress']


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'user', 'level', 'score', 'completed', 'created_at']
        read_only_fields = ['user']  # User will be set automatically in the view


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()
    
    class Meta:
        model = UserAchievement
        fields = ['achievement', 'progress', 'unlocked']
