from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    progress = models.JSONField(default=dict)  # Stores user progress

class Game(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    logic_data = models.JSONField(default=dict)  # Custom game logic data

class GameProgress(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    progress = models.JSONField(default=dict)
    last_updated = models.DateTimeField(auto_now=True)
