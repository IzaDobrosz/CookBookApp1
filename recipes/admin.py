from django.contrib import admin
from .models import Tag, Recipe, Comment


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['tag_name', 'tag_color']
    search_fields = ['tag_name']


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['name', 'ingredients', 'prep_time', 'total_time']
    search_fields = ['name']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['comment', 'created_on', 'user', 'recipe']