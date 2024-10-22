from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class Category(models.Model):
    CATEGORY_TYPES = [
        ('TYPE_OF_DISH', 'Type of Dish'),
        ('PREPARATION_METHOD', 'Preparation Method'),
        ('INGREDIENT_TYPE', 'Ingredient Type'),
        ('PREPARATION_TIME', 'Preparation Time'),
        ('DIFFICULTY_LEVEL', 'Difficulty Level'),
    ]

    SUB_CATEGORY_CHOICES = {
        'TYPE_OF_DISH': [
            ('APPETIZERS', 'Appetizers'),
            ('SOUPS', 'Soups'),
            ('SALADS', 'Salads'),
            ('MAIN_DISHES', 'Main Dishes'),
            ('DESSERTS', 'Desserts'),
            ('SNACKS', 'Snacks'),
            ('DRINKS', 'Drinks'),
            ('BREAD', 'Bread'),
        ],
        'PREPARATION_METHOD': [
            ('FRYING', 'Frying'),
            ('BOILING', 'Boiling'),
            ('GRILLING', 'Grilling'),
            ('BAKING', 'Baking'),
            ('STEAMING', 'Steaming'),
            ('SOUS-VIDE', 'Sous-vide'),
            ('RAW', 'Raw'),
        ],

        'INGREDIENT_TYPE': [
            ('VEGETABLE_BASED', 'Vegetable-Based'),
            ('MEAT_BASED', 'Meat-Based'),
            ('FISH_BASED', 'Fish-Based'),
            ('FRUIT_BASED', 'Fruit-Based'),
            ('SEAFOOD', 'Seafood'),
            ('DAIRY_BASED', 'Dairy-Based'),
            ('PASTA_RICE_BASED', 'Pasta/Rice-Based'),
        ],
        'PREPARATION_TIME': [
            ('QUICK', 'Quick (up to 30 minutes)'),
            ('MEDIUM', 'Medium (30-60 minutes)'),
            ('TIME_CONSUMING', 'Time-Consuming (over an hour)'),
        ],
        'DIFFICULTY_LEVEL': [
            ('EASY', 'Easy'),
            ('INTERMEDIATE', 'Intermediate'),
            ('DIFFICULT', 'Difficult'),
        ],
    }

    category_type = models.CharField(max_length=50, choices=CATEGORY_TYPES, verbose_name="Category Type")
    sub_category = models.CharField(max_length=50, choices=SUB_CATEGORY_CHOICES, verbose_name="Sub Category")

    class Meta:
        unique_together = ('category_type', 'sub_category')
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.get_category_type_display()}: {self.get_sub_category_display()}"


class Tag(models.Model):
    TAG_TYPES = [
        ('CUISINE_TYPE', 'Cuisine Type'),
        ('OCCASION', 'Occasion'),
        ('SEASON', 'Season'),
    ]

    TAG_CHOICES = {
        'CUISINE_TYPE': [
            ('ITALIAN', 'Italian Cuisine'),
            ('POLISH', 'Polish Cuisine'),
            ('ASIAN', 'Asian Cuisine'),
            ('MEXICAN', 'Mexican Cuisine'),
            ('FRENCH', 'French Cuisine'),
            ('MEDITERRANEAN', 'Mediterranean Cuisine'),
            ('VEGETARIAN_VEGAN', 'Vegetarian/Vegan Cuisine'),
            ('SWEDISH', 'Swedish Cuisine'),
        ],
        'OCCASION': [
            ('CHRISTMAS', 'Christmas'),
            ('EASTER', 'Easter'),
            ('VALENTINES_DAY', 'Valentine\'s Day'),
            ('NEW_YEARS_EVE', 'New Year\'s Eve'),
            ('HALLOWEEN', 'Halloween'),
            ('BIRTHDAYS', 'Birthdays'),
            ('PICNICS', 'Picnics'),
        ],
        'SEASON': [
            ('SUMMER', 'Summer'),
            ('AUTUMN', 'Autumn'),
            ('WINTER', 'Winter'),
            ('SPRING', 'Spring'),
        ],
    }

    tag_type = models.CharField(max_length=50, choices=TAG_TYPES, verbose_name="Tag Type")
    tag_label = models.CharField(max_length=50, choices=TAG_CHOICES, verbose_name="Tag label")

    class Meta:
        unique_together = ('tag_type', 'tag_label')

    def __str__(self):
        return f"{self.get_tag_type_display()}: {self.tag_label}"


class Recipe(models.Model):
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
    # Setup for Category relationships
    categories = models.ManyToManyField(Category, related_name='recipes')

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