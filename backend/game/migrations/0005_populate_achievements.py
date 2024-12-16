from django.db import migrations

def create_achievements(apps, schema_editor):
    Achievement = apps.get_model('game', 'Achievement')
    
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
        },
        {
            'title': 'Early Bird',
            'description': 'Practice typing for 5 days in a row',
            'category': 'DEDICATION',
            'icon': '🌅',
            'max_progress': 5
        },
        {
            'title': 'Typing Warrior',
            'description': 'Complete 10 different levels',
            'category': 'DEDICATION',
            'icon': '⚔️',
            'max_progress': 10
        }
    ]
    
    Achievement.objects.bulk_create([
        Achievement(**data) for data in achievements
    ])

def remove_achievements(apps, schema_editor):
    Achievement = apps.get_model('game', 'Achievement')
    Achievement.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0004_create_levels'),
    ]

    operations = [
        migrations.RunPython(create_achievements, remove_achievements),
    ] 