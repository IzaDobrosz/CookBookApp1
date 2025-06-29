from parler.models import TranslatableModel, TranslatedFields
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import json
from django.conf import settings
from django.db.models import Avg, Count
from django.utils.translation import gettext_lazy as _



class Tag(TranslatableModel):
    translations = TranslatedFields(
        tag_name = models.CharField(max_length=50, null=True, blank=True),
    )
    tag_color = models.CharField(max_length=10, default="#000000")



    def __str__(self):
        return self.safe_translation_getter('tag_name', any_language=True)


class Recipe(TranslatableModel):
    TYPE_OF_DISH_CHOICES = [
        ('APPETIZERS', _('Appetizers')),
        ('SOUPS', _('Soups')),
        ('SALADS', _('Salads')),
        ('MAIN_DISHES', _('Main Dishes')),
        ('DESSERTS', _('Desserts')),
        ('SNACKS', _('Snacks')),
        ('DRINKS', _('Drinks')),
        ('BREAD', _('Bread')),
    ]
    PREPARATION_METHOD_CHOICES = [
        ('FRYING', _('Frying')),
        ('BOILING', _('Boiling')),
        ('GRILLING', _('Grilling')),
        ('BAKING', _('Baking')),
        ('STEAMING', _('Steaming')),
        ('SOUS-VIDE', _('Sous-vide')),
        ('RAW', _('Raw')),
    ]

    INGREDIENT_TYPE_CHOICES = [
        ('VEGETABLE_BASED', _('Vegetable-Based')),
        ('MEAT_BASED', _('Meat-Based')),
        ('FISH_BASED', _('Fish-Based')),
        ('FRUIT_BASED', _('Fruit-Based')),
        ('SEAFOOD', _('Seafood')),
        ('DAIRY_BASED', _('Dairy-Based')),
        ('PASTA_RICE_BASED', _('Pasta/Rice-Based')),
    ]

    PREPARATION_TIME_CHOICES = [
        ('QUICK', _('Quick')),
        ('MEDIUM', _('Medium')),
        ('TIME_CONSUMING', _('Time-Consuming')),
    ]

    DIFFICULTY_LEVEL_CHOICES = [
        ('EASY', _('Easy')),
        ('INTERMEDIATE', _('Intermediate')),
        ('DIFFICULT', _('Difficult')),
    ]

    translations = TranslatedFields(
        name=models.CharField(max_length=255, verbose_name=_("Name of recipe")),
        description=models.TextField(verbose_name=_("Description of recipe")),
        ingredients=models.TextField(verbose_name=_("Ingredients")),
        tools=models.TextField(verbose_name=_("Tools needed")),
        preparation_steps=models.TextField(verbose_name=_("Preparation steps")),
    )

    prep_time = models.PositiveIntegerField(verbose_name=_("Preparation time"))  # in minutes
    total_time = models.PositiveIntegerField(verbose_name=_("Total time"))     # in minutes
    servings = models.PositiveIntegerField(verbose_name=_("Servings"))

    created_on = models.DateTimeField(auto_now_add=True, verbose_name=_("Created on"))
    updated_on = models.DateTimeField(auto_now=True, verbose_name=_("Updated on"))
    type_of_dish = models.CharField(max_length=100, choices=TYPE_OF_DISH_CHOICES, verbose_name=_("Type of dish"), default="Main Dishes")
    preparation_method = models.CharField(max_length=100, choices=PREPARATION_METHOD_CHOICES, verbose_name=_("Preparation method"), default="SOUS-VIDE")
    ingredient_type = models.CharField(max_length=100, choices=INGREDIENT_TYPE_CHOICES, verbose_name=_("Ingredient Type"), default="MEAT_BASED")
    preparation_time = models.CharField(max_length=100, choices=PREPARATION_TIME_CHOICES, verbose_name=_("Preparation time"), default="Medium")
    difficulty_level = models.CharField(max_length=100, choices=DIFFICULTY_LEVEL_CHOICES, verbose_name=_("Difficulty Level"), default="Easy")

    # for statistics
    views = models.PositiveIntegerField(default=0, verbose_name=_("Views"))
    ratings_count = models.PositiveIntegerField(default=0, verbose_name=_("Ratings count"))
    favorite_count = models.PositiveIntegerField(default=0, verbose_name=_("Favorite count"))
    comment_count = models.PositiveIntegerField(default=0, verbose_name=_("Comment count"))

    # Tags for additional flexible classification
    tags = models.ManyToManyField(Tag, related_name='recipes')


    class Meta:
        ordering = ['created_on']
        verbose_name = _("Recipe")
        verbose_name_plural = _("Recipes")

    def __str__(self):
        return self.safe_translation_getter('name', any_language=True)

    def update_statistics(self):
        """Update recipe statistics"""
        self.views += 1

        elf.ratings_count = self.ratings.count() if hasattr(self, 'ratings') else 0
        self.favorite_count = self.favorited_by.count() if hasattr(self, 'favorited_by') else 0

        # if hasattr(self, 'ratings'):
        #
        #     self.ratings_count = self.ratings.count()
        #
        # else:
        #     self.ratings_count = 0
        #
        #
        # if hasattr(self, 'favorited_by'):
        #     self.favorite_count = self.favorited_by.count()
        # else:
        #     self.favorite_count = 0
        #
        # if hasattr(self, 'favorited_by'):
        #     self.favorite_count = self.favorited_by.count()
        # else:
        #     self.favorite_count = 0

        self.save()
#
# # Proxy model with translations
# class TranslatableRecipe(TranslatableModel, Recipe):
#     class Meta:
#         proxy = True
#
#     translations = TranslatedFields(
#         # name=models.CharField(max_length=255, verbose_name="Name of recipe"),
#         # description=models.TextField(verbose_name="Description of recipe"),
#         # ingredients=models.TextField(verbose_name="Ingredients"),
#         # tools=models.TextField(verbose_name="Tools needed"),
#         # preparation_steps=models.TextField(verbose_name="Preparation steps"),
#     )

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

class RecipeStep(TranslatableModel):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number = models.PositiveIntegerField(verbose_name="Step number", default=1)

    temperature = models.IntegerField(null=True, blank=True, verbose_name="Temperature")
    time = models.DurationField(null=True, blank=True, verbose_name="Time")    # time as timedelta

    translations = TranslatedFields(
        instruction=models.TextField(verbose_name="Instruction", default="")
    )
    class Meta:
        ordering = ['step_number']
        unique_together = ('recipe', 'step_number')    # Unique step_number within one recipe

    def __str__(self):
        return f'{self.step_number}: {self.safe_translation_getter("instruction", any_language=True)}'


class Comment(models.Model):
    comment = models.TextField(verbose_name=_("Comment"))
    created_on = models.DateTimeField(auto_now_add=True, verbose_name=_("Created on"))
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, verbose_name=_("Recipe"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name=_("User"))

    language = models.CharField(
        max_length=10,
        default='en',
        verbose_name=_("Original Language"),
        help_text=_("Language code of the original comment.")
    )

    translated_comment = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_("Translated Comment"),
        help_text=_("Dictionary with translated versions of the comment.")
    )

    def __str__(self):
        return f"{self.user} - {self.comment[:30]}"

# Extension of User model to serve "favorites"
class User(AbstractUser):
    favorite_recipes = models.ManyToManyField('Recipe', related_name='favorited_by', blank=True)


class FavoriteRecipes(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorited_by')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorites')
    cookbook_name = models.CharField(max_length=255, verbose_name="Cookbook name", default="My CookBook", blank=True)
    added_on = models.DateTimeField(auto_now_add=True, verbose_name="Added on")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes", default="")

    class Meta:
        ordering = ['added_on']
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f'{self.user.username}: {self.cookbook_name}'


class Rating(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0, verbose_name="Rating")
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recipe', 'user')


