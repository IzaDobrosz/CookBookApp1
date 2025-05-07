from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.reverse import reverse
from .models import Tag, Recipe, Comment, RecipeStep, FavoriteRecipes, Rating
from parler_rest.serializers import TranslatableModelSerializer
from parler_rest.fields import TranslatedFieldsField

class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'id', 'tag_name', 'tag_color']


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    notes = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Recipe
        fields = [
            'url', 'id', 'name', 'description', 'prep_time', 'total_time',
            'servings', 'ingredients', 'tools', 'preparation_steps', 'type_of_dish',
            'preparation_method','ingredient_type','preparation_time','difficulty_level',
            'created_on', 'updated_on','tags', 'notes', 'is_favorite', 'average_rating',
        ]

    def get_notes(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            favorite = FavoriteRecipes.objects.filter(recipe=obj, user=user).first()
            return favorite.notes if favorite else None
        return None

    def get_is_favorite(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return FavoriteRecipes.objects.filter(recipe=obj, user=user).exists()
        return False





    # def get_steps_url(self, obj):
    #     """Generate the URL for the steps of certain recipe."""
    #     request = self.context.get('request')  # Get the request context for absolute URL
    #     return reverse('recipe_steps', kwargs={'recipe_id': obj.id}, request=request)

class RecipeStepSerializer(TranslatableModelSerializer):
    url = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()    # Przesyłaj czas w sekundach
    translations = TranslatedFieldsField(shared_model=RecipeStep)

    class Meta:
        model = RecipeStep
        fields = ['url', 'recipe_id', 'step_number', 'translations', 'temperature', 'time']

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
    user_id = serializers.PrimaryKeyRelatedField(source='user.id', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'user_id', 'comment', 'created_on']
        read_only_fields = ['user', 'user_id', 'created_on', 'recipe']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
   Serializer for the User model.

   This serializer converts User model instances into representations
   that can be rendered into JSON or other content types. It includes the
   user's URL, ID, username, and their related categories (read-only).
   """
    recipes = serializers.HyperlinkedRelatedField(many=True, view_name='recipe-detail', read_only=True)
    favorite_recipes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'recipes', 'favorite_recipes']


class FavoriteRecipesSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(source='recipe.id', read_only=True)
    recipe_name = serializers.CharField(source='recipe.name', read_only=True)

    class Meta:
        model = FavoriteRecipes
        fields = ['recipe_id', 'user', 'added_on', 'notes', 'cookbook_name', 'recipe_name']
        read_only_fields = ['user', 'added_on', 'cookbook_name']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'recipe', 'user', 'rating', 'created_on']
        read_only_fields = ['user', 'created_on']
