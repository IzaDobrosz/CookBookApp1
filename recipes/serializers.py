from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tag, Recipe, Comment


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'id', 'tag_type', 'tag_label']


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True, read_only=True)



    class Meta:
        model = Recipe
        fields = ['url', 'id', 'name', 'description', 'prep_time', 'total_time', 'servings', 'ingredients', 'tools', 'preparation_steps', 'categories', 'tags']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'content', 'created_on']
        read_only_fields = ['user', 'created_on']