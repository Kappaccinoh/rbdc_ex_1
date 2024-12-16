from django.db import migrations, models
import uuid

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('difficulty', models.IntegerField()),
                ('challenge_text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'game_level',
            },
        ),
    ] 