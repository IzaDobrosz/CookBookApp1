# Generated by Django 5.2.1 on 2025-05-15 17:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0002_comment_language_comment_translated_comment_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='recipe',
            options={'ordering': ['created_on'], 'verbose_name': 'Recipe', 'verbose_name_plural': 'Recipes'},
        ),
        migrations.AlterModelOptions(
            name='recipetranslation',
            options={'default_permissions': (), 'managed': True, 'verbose_name': 'Recipe Translation'},
        ),
    ]
