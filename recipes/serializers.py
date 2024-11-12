from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tag, Recipe, Comment, RecipeStep


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'id', 'tag_name', 'tag_color']


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['url', 'id', 'name', 'description', 'prep_time', 'total_time', 'servings', 'ingredients', 'tools', 'preparation_steps', 'type_of_dish', 'preparation_method','ingredient_type','preparation_time','difficulty_level', 'tags']


class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = ['recipe', 'step_details']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'content', 'created_on']
        read_only_fields = ['user', 'created_on']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
   Serializer for the User model.

   This serializer converts User model instances into representations
   that can be rendered into JSON or other content types. It includes the
   user's URL, ID, username, and their related categories (read-only).
   """
    recipes = serializers.HyperlinkedRelatedField(many=True, view_name='category-detail', read_only=True)

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'recipes']
