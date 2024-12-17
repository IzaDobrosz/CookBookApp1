from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.reverse import reverse
from .models import Tag, Recipe, Comment, RecipeStep


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'id', 'tag_name', 'tag_color']


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    # steps_url = serializers.SerializerMethodField()  # Declare steps_url as a custom field

    class Meta:
        model = Recipe
        fields = [
            'url', 'id', 'name', 'description', 'prep_time', 'total_time',
            'servings', 'ingredients', 'tools', 'preparation_steps', 'type_of_dish',
            'preparation_method','ingredient_type','preparation_time','difficulty_level',
            'created_on', 'updated_on','tags'
        ]

    # def get_steps_url(self, obj):
    #     """Generate the URL for the steps of certain recipe."""
    #     request = self.context.get('request')  # Get the request context for absolute URL
    #     return reverse('recipe_steps', kwargs={'recipe_id': obj.id}, request=request)

class RecipeStepSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()    # Przesyłaj czas w sekundach

    class Meta:
        model = RecipeStep
        fields = ['url', 'recipe_id', 'step_number', 'instruction', 'temperature', 'time']

    def get_url(self, obj):
        """Generate the URL for the steps of a certain recipe."""
        request = self.context.get('request')  # Get the request context for absolute URL
        return reverse('recipe_step_detail',
                       kwargs={'recipe_id': obj.recipe.id, 'step': obj.step_number},
                       request=request)

    def get_time(self, obj):
        """Convert timedelta to total seconds."""
        if obj.time:
            return int(obj.time.total_seconds())  # Konwertuj timedelta na sekundy
        return None

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'comment', 'created_on']
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
