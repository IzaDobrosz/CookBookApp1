from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    tag_name = models.CharField(max_length=50, null=True, blank=True)
    tag_color = models.CharField(max_length=10, default="#FFFFFF")

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


class Comment(models.Model):
    comment = models.TextField(verbose_name="Comment")
    created_on = models.DateTimeField(auto_now_add=True, verbose_name="Created on")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)