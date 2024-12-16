from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0002_create_level_model'),
    ]

    operations = [
        migrations.CreateModel(
            name='Achievement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('category', models.CharField(choices=[
                    ('SPEED', 'Speed Demon'),
                    ('ACCURACY', 'Accuracy Master'),
                    ('DEDICATION', 'Dedication'),
                    ('SPECIAL', 'Special Skills'),
                ], max_length=20)),
                ('icon', models.CharField(max_length=10)),
                ('max_progress', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='UserAchievement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progress', models.IntegerField(default=0)),
                ('unlocked', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('achievement', models.ForeignKey(on_delete=models.deletion.CASCADE, to='game.achievement')),
                ('user', models.ForeignKey(on_delete=models.deletion.CASCADE, to='game.user')),
            ],
        ),
    ] 