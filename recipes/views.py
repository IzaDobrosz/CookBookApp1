from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from .models import Tag, Recipe, User, RecipeStep
from .serializers import TagSerializer, RecipeSerializer, UserSerializer, RecipeStepSerializer


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class RecipeListView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeStepsView(APIView):
    def get(self, request, recipe_id, step=None):
        try:
            recipe = Recipe.objects.get(pk=recipe_id)

            if step is not None:
                # Fetch the specific step by step_number from the step_details JSON field
                recipe_step = RecipeStep.objects.filter(recipe=recipe, step_details__step_number=step).first()
                if not recipe_step:
                    return Response({"detail": "Step not found"}, status=404)

                # Return the specific step as serialized data
                serializer = RecipeStepSerializer(recipe_step)
                return Response( {'step': serializer.data})

            # Otherwise, fetch all steps
            recipe_steps = RecipeStep.objects.filter(recipe=recipe).order_by('step_details__step_number')
            serializer = RecipeStepSerializer(recipe_steps, many=True)
            return Response({'steps': serializer.data})

        except Recipe.DoesNotExist:
            return Response({"detail": "Recipe not found"}, status=404)

class UserList(generics.ListAPIView):
    """
    API view to retrieve a list of users.

    This view provides a `GET` method handler to list all users in the system.
    It uses Django REST framework's `ListAPIView` to provide a read-only endpoint
    for the User model.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    """
    API view to retrieve a single user instance by ID.

    This view provides a `GET` method handler to fetch details of a single user.
    It uses Django REST framework's `RetrieveAPIView` to provide a read-only endpoint
    for retrieving user details.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """
    Root view for the API.

    This view provides a central entry point for the API, returning a list of
    available endpoints. It supports the GET method and returns hyperlinks to
    the 'user-list', 'category-list', and 'expense-list' endpoints in order to help
    users to navigate to different parts of the API.

    Args:
        request: The HTTP request object.
        format: Optional format suffix for the URLs.

    Returns:
        Response: A dictionary containing the API's main endpoints.
    """
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'recipes': reverse('recipe-list', request=request, format=format),
        'tags': reverse('tag-list', request=request, format=format),
    })
