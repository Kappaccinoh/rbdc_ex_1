from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


# Custom User Model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, null=True, blank=True, default=None)  # Add default=None
    is_guest = models.BooleanField(default=False)
    guest_token = models.UUIDField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_guest:
            self.guest_token = uuid.uuid4()
            self.email = None  # Ensure guest users have no email
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


# Game Levels
from django.db import models
import uuid

class Level(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)  # Name of the level
    difficulty = models.IntegerField()  # Difficulty rating (1 to 5)
    challenge_text = models.TextField()  # Text to type in the level
    created_at = models.DateTimeField(auto_now_add=True)  # Auto-generated timestamp for creation

    def __str__(self):
        return f"Level {self.name} - Difficulty {self.difficulty}"

    class Meta:
        db_table = "game_level"  # Explicitly name the table



# Progress
class Progress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="progress")
    level = models.ForeignKey('Level', on_delete=models.CASCADE, related_name="progress")
    score = models.IntegerField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    accuracy = models.FloatField(default=0)  # Store accuracy as percentage

    def __str__(self):
        return f"{self.user.username} - {self.level.name} - Score: {self.score}"


# Achievements
from django.db import models
import uuid

class Achievement(models.Model):
    CATEGORIES = [
        ('SPEED', 'Speed Demon'),
        ('ACCURACY', 'Accuracy Master'),
        ('DEDICATION', 'Dedication'),
        ('SPECIAL', 'Special Skills'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORIES)
    icon = models.CharField(max_length=10)  # For storing emoji
    max_progress = models.IntegerField()

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    unlocked = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)


# Rewards (User's Earned Achievements)
class Reward(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="rewards")
    achievement = models.ForeignKey('Achievement', on_delete=models.CASCADE, related_name="rewards")
    earned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} earned {self.achievement.name}"


# Streaks
class Streak(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="streaks")
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_active = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} - Current: {self.current_streak}, Longest: {self.longest_streak}"
