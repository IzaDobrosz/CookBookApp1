# Generated by Django 5.0.3 on 2024-11-14 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0007_alter_recipestep_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipestep',
            name='instruction',
            field=models.TextField(default='No instruction provided', verbose_name='Instruction'),
        ),
    ]