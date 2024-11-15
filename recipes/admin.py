from django.contrib import admin

from .forms import RecipeStepForm
from .models import Tag, Recipe, Comment, RecipeStep


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['tag_name', 'tag_color']
    search_fields = ['tag_name']


# @admin.register(Recipe)
# class RecipeAdmin(admin.ModelAdmin):
#     list_display = ['name', 'ingredients', 'prep_time', 'total_time']
#     search_fields = ['name']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['comment', 'created_on', 'user', 'recipe']


# @admin.register(RecipeSteps)
# class RecipeStepAdmin(admin.ModelAdmin):
#     pass

# # creation of forms for connected models - inlines
# class RecipeStepInline(admin.StackedInline):
#     model = RecipeStep
#     form = RecipeStepForm
#     extra = 1   #number of empty forms
#
# @admin.register(Recipe)
# class RecipeAdmin(admin.ModelAdmin):
#     inlines = [RecipeStepInline]

class RecipeStepInline(admin.StackedInline):
    model = RecipeStep
    form = RecipeStepForm
    extra = 1    # Number of empty forms shown by default

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    inlines = [RecipeStepInline]
    # list_display = ['name', 'ingredients', 'prep_time', 'total_time']