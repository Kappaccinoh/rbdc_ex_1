from django.core.management.base import BaseCommand
from django.utils import timezone
from game.models import User, Level, Achievement, UserAchievement, Progress, Streak
import uuid
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create test users
        test_user = User.objects.create_user(
            username='test_user',
            password='test123',
            email='test@example.com',
            is_guest=False
        )

        guest_user = User.objects.create_user(
            username=f'guest_{uuid.uuid4().hex[:8]}',
            is_guest=True
        )

        # Create levels
        levels = [
            {
                'name': 'Home Row Basics',
                'difficulty': 1,
                'challenge_text': 'asdf jkl; asdf jkl; asdf jkl;'
            },
            {
                'name': 'Home Row Words',
                'difficulty': 1,
                'challenge_text': 'dad fall sad lake fall dad sad lake'
            },
            {
                'name': 'Top Row Introduction',
                'difficulty': 2,
                'challenge_text': 'qwerty qwerty qwerty qwerty'
            },
            {
                'name': 'Mixed Practice',
                'difficulty': 2,
                'challenge_text': 'the quick brown fox jumps over the lazy dog'
            }
        ]

        created_levels = []
        for level_data in levels:
            level = Level.objects.create(**level_data)
            created_levels.append(level)

        # Create achievements
        achievements = [
            {
                'title': 'Quick Starter',
                'description': 'Type 20 words per minute',
                'category': 'SPEED',
                'icon': '⚡',
                'max_progress': 20
            },
            {
                'title': 'Speed Racer',
                'description': 'Type 40 words per minute',
                'category': 'SPEED',
                'icon': '🏃',
                'max_progress': 40
            },
            {
                'title': 'Lightning Fingers',
                'description': 'Type 60 words per minute',
                'category': 'SPEED',
                'icon': '⚡',
                'max_progress': 60
            },
            {
                'title': 'Sharp Eye',
                'description': 'Complete a level with 95% accuracy',
                'category': 'ACCURACY',
                'icon': '🎯',
                'max_progress': 95
            },
            {
                'title': 'Perfect Round',
                'description': 'Complete any level with 100% accuracy',
                'category': 'ACCURACY',
                'icon': '✨',
                'max_progress': 100
            }
        ]

        created_achievements = []
        for achievement_data in achievements:
            achievement = Achievement.objects.create(**achievement_data)
            created_achievements.append(achievement)

        # Create progress entries for test_user
        for level in created_levels[:2]:  # First two levels completed
            Progress.objects.create(
                user=test_user,
                level=level,
                score=35,  # WPM
                completed=True,
                accuracy=92.5,
                created_at=timezone.now() - timedelta(days=1)
            )

        # Create some progress for guest user
        Progress.objects.create(
            user=guest_user,
            level=created_levels[0],
            score=25,
            completed=True,
            accuracy=88.0,
            created_at=timezone.now()
        )

        # Create user achievements
        for achievement in created_achievements:
            UserAchievement.objects.create(
                user=test_user,
                achievement=achievement,
                progress=achievement.max_progress // 2,  # Half complete
                unlocked=False
            )
            UserAchievement.objects.create(
                user=guest_user,
                achievement=achievement,
                progress=achievement.max_progress // 4,  # Quarter complete
                unlocked=False
            )

        # Create streaks
        Streak.objects.create(
            user=test_user,
            current_streak=5,
            longest_streak=7,
            last_active=timezone.now()
        )

        Streak.objects.create(
            user=guest_user,
            current_streak=1,
            longest_streak=1,
            last_active=timezone.now()
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database')) 