# Generated by Django 5.0.3 on 2024-11-15 07:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0008_alter_recipestep_instruction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipestep',
            name='step_number',
            field=models.PositiveIntegerField(default=1, verbose_name='Step number'),
        ),
    ]
