from django.core.management.base import BaseCommand
from game.models import Level, Achievement

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        # Clear existing data to avoid duplication
        Level.objects.all().delete()
        Achievement.objects.all().delete()

        # Seed Levels
        levels = [
            {"name": "Level 1", "difficulty": 1, "challenge_text": "Type 'A'"},
            {"name": "Level 2", "difficulty": 2, "challenge_text": "Type 'Hello World!'"},
            {"name": "Level 3", "difficulty": 3, "challenge_text": "Type 'Django is fun!'"},
            {"name": "Level 4", "difficulty": 4, "challenge_text": "Type 'Custom management commands are awesome!'"},
            {"name": "Level 5", "difficulty": 5, "challenge_text": "Type 'Practice makes perfect!'"},
        ]
        for level in levels:
            Level.objects.create(**level)
        self.stdout.write(self.style.SUCCESS('Levels seeded successfully!'))

        # Seed Achievements
        achievements = [
            {"name": "First Steps", "description": "Complete your first level!", "icon_url": "first_steps.png"},
            {"name": "Fast Typer", "description": "Type 50 words per minute!", "icon_url": "fast_typer.png"},
            {"name": "Streak Master", "description": "Maintain a 7-day streak!", "icon_url": "streak_master.png"},
        ]
        for achievement in achievements:
            Achievement.objects.create(**achievement)
        self.stdout.write(self.style.SUCCESS('Achievements seeded successfully!'))

        # Final message
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
