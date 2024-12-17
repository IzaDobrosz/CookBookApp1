from dataclasses import field

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import json
from django.conf import settings

class Tag(models.Model):
    tag_name = models.CharField(max_length=50, null=True, blank=True)
    tag_color = models.CharField(max_length=10, default="#000000")

    class Meta:
        ordering = ['tag_name']

    def __str__(self):
        return self.tag_name


class Recipe(models.Model):
    TYPE_OF_DISH_CHOICES = [
        ('APPETIZERS', 'Appetizers'),
        ('SOUPS', 'Soups'),
        ('SALADS', 'Salads'),
        ('MAIN_DISHES', 'Main Dishes'),
        ('DESSERTS', 'Desserts'),
        ('SNACKS', 'Snacks'),
        ('DRINKS', 'Drinks'),
        ('BREAD', 'Bread'),
    ]
    PREPARATION_METHOD_CHOICES = [
        ('FRYING', 'Frying'),
        ('BOILING', 'Boiling'),
        ('GRILLING', 'Grilling'),
        ('BAKING', 'Baking'),
        ('STEAMING', 'Steaming'),
        ('SOUS-VIDE', 'Sous-vide'),
        ('RAW', 'Raw'),
    ]

    INGREDIENT_TYPE_CHOICES = [
        ('VEGETABLE_BASED', 'Vegetable-Based'),
        ('MEAT_BASED', 'Meat-Based'),
        ('FISH_BASED', 'Fish-Based'),
        ('FRUIT_BASED', 'Fruit-Based'),
        ('SEAFOOD', 'Seafood'),
        ('DAIRY_BASED', 'Dairy-Based'),
        ('PASTA_RICE_BASED', 'Pasta/Rice-Based'),
    ]

    PREPARATION_TIME_CHOICES = [
        ('QUICK', 'Quick'),
        ('MEDIUM', 'Medium'),
        ('TIME_CONSUMING', 'Time-Consuming'),
    ]

    DIFFICULTY_LEVEL_CHOICES = [
        ('EASY', 'Easy'),
        ('INTERMEDIATE', 'Intermediate'),
        ('DIFFICULT', 'Difficult'),
    ]

    name = models.CharField(max_length=255, verbose_name="Name of recipe")
    description = models.TextField(verbose_name="Description of recipe")
    prep_time = models.IntegerField(verbose_name="Preparation time")  # in minutes
    total_time = models.IntegerField(verbose_name="Total time")  # in minutes
    servings = models.IntegerField(verbose_name="Servings")
    ingredients = models.TextField(verbose_name="Ingredients")
    tools = models.TextField(verbose_name="Tools needed")
    preparation_steps = models.TextField(verbose_name="Preparation steps")
    created_on = models.DateTimeField(auto_now_add=True, verbose_name="Created on")
    updated_on = models.DateTimeField(auto_now=True, verbose_name="Updated on")
    type_of_dish = models.CharField(max_length=100, choices=TYPE_OF_DISH_CHOICES, verbose_name="Type of dish", default="Main Dishes")
    preparation_method = models.CharField(max_length=100, choices=PREPARATION_METHOD_CHOICES, verbose_name="Preparation method", default="SOUS-VIDE")
    ingredient_type = models.CharField(max_length=100, choices=INGREDIENT_TYPE_CHOICES, verbose_name="Ingredient Type", default="MEAT_BASED")
    preparation_time = models.CharField(max_length=100, choices=PREPARATION_TIME_CHOICES, verbose_name="Preparation time", default="Medium")
    difficulty_level = models.CharField(max_length=100, choices=DIFFICULTY_LEVEL_CHOICES, verbose_name="Difficulty Level", default="Easy")

    # Tags for additional flexible classification
    tags = models.ManyToManyField(Tag, related_name='recipes')

    class Meta:
        ordering = ['created_on']

    def __str__(self):
        return self.name

#
# # Non-standard validator for JSONField that can be used directly in the model field
# def validate_step_data(value):
#     # Check if value is a list of steps
#     if not isinstance(value, list):
#         raise ValidationError("Steps must be provided as a list.")
#
#     # Iterate over each step and validate fields
#     for step in value:
#         # Each step must be a dictionary
#         if not isinstance(step, dict):
#             raise ValidationError("Each step must be a dictionary.")
#
#         # Validate 'step_number' (required, integer)
#         if "step_number" not in step or not isinstance(step["step_number"], int):
#             raise ValidationError("Each step must contain an integer 'step_number'.")
#
#         # Validate 'instruction' (required, string)
#         if "instruction" not in step or not isinstance(step["instruction"], str):
#             raise ValidationError("Each step must contain a text 'instruction'.")
#
#         # Optional 'temperature' field (integer or None)
#         if "temperature" in step and not (step["temperature"] is None or isinstance(step["temperature"], int)):
#             raise ValidationError("Optional 'temperature' must be an integer or null.")
#
#         # Optional 'time' field (integer or None)
#         if "time" in step and not (step["time"] is None or isinstance(step["time"], int)):
#             raise ValidationError("Optional 'time' must be an integer or null.")

class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number = models.PositiveIntegerField(verbose_name="Step number", default=1)
    instruction = models.TextField(verbose_name="Instruction", default="No instruction provided")
    temperature = models.IntegerField(null=True, blank=True, verbose_name="Temperature")
    time = models.DurationField(null=True, blank=True, verbose_name="Time")    # time as timedelta

    class Meta:
        ordering = ['step_number']
        unique_together = ('recipe', 'step_number')    # Unique step_number within one recipe

    def __str__(self):
        return f'{self.step_number}: {self.instruction}'


class Comment(models.Model):
    comment = models.TextField(verbose_name="Comment")
    created_on = models.DateTimeField(auto_now_add=True, verbose_name="Created on")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

# Extension of User model to serve "favorites"
class User(AbstractUser):
    favorite_recipes = models.ManyToManyField('Recipe', related_name='favorited_by', blank=True)