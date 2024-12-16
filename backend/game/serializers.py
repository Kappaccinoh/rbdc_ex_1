from rest_framework import serializers
from game.models import Level, Achievement, Progress

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name', 'difficulty', 'challenge_text', 'created_at']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon_url', 'created_at']


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'user', 'level', 'score', 'completed', 'created_at']
        read_only_fields = ['user']  # User will be set automatically in the view
