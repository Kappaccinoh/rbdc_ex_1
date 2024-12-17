from django.core.management.base import BaseCommand
from django.utils import timezone
from game.models import User, Streak, Achievement, UserAchievement

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **kwargs):
        # Create test users
        test_user = User.objects.create_user(username='testuser', password='password')
        guest_user = User.objects.create_user(username='guestuser', password='password', is_guest=True)

        # Create achievements
        created_achievements = [
            Achievement.objects.create(
                title=f"Achievement {i}",
                description=f"Description for achievement {i}",
                category='SPEED',
                icon='🏆',
                max_progress=100
            ) for i in range(1, 6)
        ]

        # Create user achievements
        for achievement in created_achievements:
            UserAchievement.objects.create(
                user=test_user,
                achievement=achievement,
                progress=0,  # Start with 0 progress
                unlocked=False
            )
            UserAchievement.objects.create(
                user=guest_user,
                achievement=achievement,
                progress=0,  # Start with 0 progress
                unlocked=False
            )

        # Initialize streaks to 0
        Streak.objects.create(
            user=test_user,
            current_streak=0,
            longest_streak=0,
            last_active=timezone.now()
        )

        Streak.objects.create(
            user=guest_user,
            current_streak=0,
            longest_streak=0,
            last_active=timezone.now()
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database')) 