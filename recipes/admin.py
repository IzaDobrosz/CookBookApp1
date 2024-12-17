from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model    # to return non standard user model
from rest_framework.authtoken.models import Token
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

# Get model User
User = get_user_model()

# Register User
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_active']
    search_fields = ['username', 'email']
    list_filter = ['date_joined', 'last_login', 'is_active']


# Due to token reaching to default user (conflict) => unregister TokenAdmin
try:
    admin.site.unregister(Token)
except admin.sites.NotRegistered:  # If Token is not registered yet, ignore exception
    pass


# Register TokenAdmin manually with customized config
@admin.register(Token)
class CustomTokenAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user']
    list_display = ['key', 'user', 'created']