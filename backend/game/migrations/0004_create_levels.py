from django.db import migrations

def create_levels(apps, schema_editor):
    Level = apps.get_model('game', 'Level')
    
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
    
    Level.objects.bulk_create([
        Level(**data) for data in levels
    ])

def remove_levels(apps, schema_editor):
    Level = apps.get_model('game', 'Level')
    Level.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0003_create_achievement_models'),
    ]

    operations = [
        migrations.RunPython(create_levels, remove_levels),
    ] 