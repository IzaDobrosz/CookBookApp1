from ast import Index
from http.client import responses, HTTPResponse
from http.cookiejar import logger
from pydoc import resolve
from textwrap import wrap

from django.contrib.auth import authenticate
from django.core.serializers import serialize
from django.db.migrations import serializer
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render
from django.template.defaulttags import comment
from rest_framework import generics, permissions
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from rest_framework.viewsets import ModelViewSet
from django.db.models import Avg, Value, Count
from django.db.models.functions import Coalesce
from googletrans import Translator
from django.utils.translation import gettext as _

from .models import Tag, Recipe, User, RecipeStep, Comment, FavoriteRecipes, Rating
from .serializers import TagSerializer, RecipeSerializer, UserSerializer, RecipeStepSerializer, CommentSerializer, \
    FavoriteRecipesSerializer, RatingSerializer
from .permissions import IsOwnerOrReadOnly
from datetime import timedelta
from django.utils.timezone import now
import logging


class TagListView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class RecipeListView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.annotate(average_rating=Avg('ratings__rating'))
    serializer_class = RecipeSerializer
    # popular_recipes = Recipe.objects.annotate(average_rating=Avg('ratings__rating'))

class RecipeStepDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecipeStep.objects.all()
    serializer_class = RecipeStepSerializer
    lookup_field = 'step_number'    # 'step_number' as unique identifier of step
    lookup_url_kwarg = 'step'       # Name of parameter in URL

    def get_queryset(self):
        """Filter steps based on "recipe_id" to secure display of steps to correct recipe"""
        recipe_id = self.kwargs['recipe_id']
        step_number = self.kwargs['step']
        return RecipeStep.objects.filter(recipe_id=recipe_id, step_number=step_number)


class RecipeAllStepsListView(ListAPIView):
    serializer_class = RecipeStepSerializer

    def get_queryset(self):
        recipe_id = self.kwargs['recipe_id']
        return RecipeStep.objects.filter(recipe_id=recipe_id).order_by('step_number')


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


class CommentListCreateView(generics.ListCreateAPIView):
    # queryset = Comment.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]    # Allow unauthenticated users to view, authenticated to post

    serializer_class = CommentSerializer

    def get_queryset(self):
        recipe_id = self.kwargs['recipe_id']      # Take ID of recipe from URL
        return Comment.objects.filter(recipe_id=recipe_id).order_by('-created_on')    #Filter comments for certain recipe


    def list(self, request, *args, **kwargs):
        # function overriding list method to modify API response
        # and include recipe-name from other model
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        recipe = get_object_or_404(Recipe, id=self.kwargs.get('recipe_id'))
        # recipe = Recipe.objects.get(id=self.kwargs.get('recipe_id'))  # Get recipe
        return Response({
            'recipe_name': recipe.name,
            'comments': serializer.data
        })


    def perform_create(self, serializer):
        recipe_id = self.kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)   # When recipe doesnt exist
        serializer.save(user=self.request.user, recipe=recipe)    # Save the current user who posted the comment
        recipe.comment_count += 1
        recipe.save()


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    #previous
    # def get_object(self):
    #     comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
    #
    #     # Check if user is author of comment
    #     self.check_object_permissions(self.request, comment)
    #     return comment

    # retrieve() to serve ?to=xx - tranlsation only when user ask for it
    def retrieve(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])

    #     For tralnslations
        target_lang = request.query_params.get('to')
        if target_lang:
            if comment.translated_comment and target_lang in comment.translated_comment:
                translated = comment.translated_comment[target_lang]
            else:
                translator = Translator()
                try:
                    translation = translator.translate( comment.comment, dest=target_lang, src=comment.language)
                    translated = translation.text
                except Exception as e:
                    return Response({'detail': _('Translation failed'), 'error': str(e)}, status=400)


                # SAve to cache
                if not comment.translated_comment:
                    comment.translated_comment = {}
                comment.translated_comment[target_lang] = translated
                comment.save()

            return Response({
                'id': comment.id,
                'original': comment.comment,
                'translated': translated,
                'original_language': comment.language,
                'target_language': target_lang,
            })

        # If not tranlation request - return standr serializer
        serializer = self.get_serializer(comment)
        return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if now() - instance.created_on > timedelta(minutes=15):
            return Response({'detail': 'Comments can only be edited within 15 minutes after posting.'}, status=403)
        return super().update(request, *args, **kwargs)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        recipe = instance.recipe
        recipe.comment_count -= 1
        recipe.save()
        return super().destroy(request, *args, **kwargs)

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
        # 'recipe_steps': "Use `/recipe/{recipe_id}/steps/` to access steps for a specific recipe.",
    })


class LandingPageView(APIView):
    """
    Class-based view to fetch data for the landing page.
    """

    def get(self, request, format=None):
        # Fetch 5 newest recipes
        new_recipes = Recipe.objects.order_by('-created_on')[:5]
        # Fetch 5 most popular recipes
        popular_recipes = Recipe.objects.annotate(average_rating=Avg('ratings__rating')) \
                                    .order_by('-average_rating')[:5]   # ten kod do SPRAWDZENIA
        # Count all recipes
        recipe_count = Recipe.objects.count()

        # Prepare data for the response
        data = {
            "new_recipes": RecipeSerializer(new_recipes, many=True, context={'request': request}).data,    # Serializacja
            "popular_recipes": RecipeSerializer(popular_recipes, many=True, context={'request': request}).data,
            "total_recipes": recipe_count,
        }
        return Response(data)


# class FavoriteRecipesView(APIView):
#     """
#     View to handle user's favorite recipes:
#     - GET: Retrieve all favorite recipes of the authenticated user.
#     - POST: Add a new recipe to favorites.
#     - PATCH: Update notes for a favorite recipe.
#     - DELETE: Remove a recipe from favorites.
#     """
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
#         """
#         Get all favorite recipes for the logged-in user.
#         """
#         user = request.user
#         favorite_recipes = FavoriteRecipes.objects.filter(user=user)  # Get all favorite recipes of user
#         # Add context to the serializer
#         serializer = FavoriteRecipesSerializer(favorite_recipes, many=True, context={'request': request})
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
#     def post(self, request):
#         """
#         Add a recipe to favorites.
#         """
#         recipe_id = request.data.get("recipe_id")
#         notes = request.data.get("notes", "")  # Default notes to an empty string
#
#         try:
#             recipe = Recipe.objects.get(id=recipe_id)
#         except Recipe.DoesNotExist:
#             return Response({'message': 'Recipe not found.'}, status=status.HTTP_404_NOT_FOUND)
#
#         favorite, created = FavoriteRecipes.objects.get_or_create(
#             user=request.user, recipe=recipe,
#             defaults={'notes': notes}
#         )
#
#         if created:
#             # Add context to the serializer
#             return Response({
#                 'message': 'Recipe added to favorites.',
#                 'recipe': FavoriteRecipesSerializer(favorite, context={'request': request}).data  # Return created favorite details
#             }, status=status.HTTP_201_CREATED)
#
#         return Response({
#             'message': 'Recipe is already in favorites.',
#             'recipe': FavoriteRecipesSerializer(favorite, context={'request': request}).data  # Include existing favorite details
#         }, status=status.HTTP_200_OK)
#
#     def patch(self, request, recipe_id):
#         """
#         Update notes for a favorite recipe.
#         """
#         try:
#             favorite = FavoriteRecipes.objects.get(user=request.user, recipe_id=recipe_id)
#         except FavoriteRecipes.DoesNotExist:
#             return Response({'message': 'Recipe not in favorites.'}, status=status.HTTP_404_NOT_FOUND)
#
#         notes = request.data.get("notes", "")  # Default to an empty string if notes are not provided
#         favorite.notes = notes
#         favorite.save()
#         return Response({
#             'message': 'Notes updated successfully.',
#             'notes': favorite.notes
#         }, status=status.HTTP_200_OK)
#
#     def delete(self, request, recipe_id):
#         """
#         Remove a recipe from favorites.
#         """
#         try:
#             favorite = FavoriteRecipes.objects.get(user=request.user, recipe_id=recipe_id)
#             favorite.delete()
#             return Response({'message': 'Recipe removed from favorites.'}, status=status.HTTP_204_NO_CONTENT)
#         except FavoriteRecipes.DoesNotExist:
#             return Response({'message': 'Recipe not found in Favorites.'}, status=status.HTTP_404_NOT_FOUND)
#
class FavoriteRecipesListView(generics.ListCreateAPIView):
    """
    View for listing favorite recipes.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteRecipesSerializer


    def get_queryset(self):
        """
        Return favorite recipes for the authenticated user.
        """
        return FavoriteRecipes.objects.filter(user=self.request.user).select_related('recipe')


class AddToFavoriteView(APIView):

    def post(self, request, recipe_id, format=None):
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)

        # Check if recipe id alresy in favorites
        favorite_recipe, created = FavoriteRecipes.objects.get_or_create(user=user, recipe=recipe)
        if created:
            return Response({'detail': 'Recipe has been added.'}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Recipe already exists in favorites.'}, status=status.HTTP_200_OK)


class RemoveFromFavoriteView(APIView):

    def delete(self, request, recipe_id, format=None):
        user = self.request.user
        recipe = get_object_or_404(Recipe, id=recipe_id)

        # Check if recipe is in favorites
        favorite = FavoriteRecipes.objects.filter(user=user, recipe=recipe)
        if favorite:
            favorite.delete()
            return Response({'detail': 'Recipe has been removed.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Recipe is not in favorites.'}, status=status.HTTP_404_NOT_FOUND)


class RecipeNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, recipe_id):
        # Check if in user's favorites
        try:
            favorite = FavoriteRecipes.objects.get(user=request.user, recipe_id=recipe_id)
            return Response({"notes": favorite.notes}, status=status.HTTP_200_OK)
        except FavoriteRecipes.DoesNotExist:
            return Response({"notes": None}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, recipe_id):
        """Add/update notes"""
        try:
            favorite, created = FavoriteRecipes.objects.get_or_create(user=request.user, recipe_id=recipe_id)
            favorite.notes = request.data.get("notes", "")
            favorite.save()
            return Response({"message": "Note updated successfully."}, status=status.HTTP_201_CREATED)
        except FavoriteRecipes.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)


# class GenerateRecipePDFView(APIView):
#     """View to create PDF for single recipe"""
#
#     def get(self, request, recipe_id):
#         try:
#             # Get recipe from database
#             recipe = Recipe.objects.get(id=recipe_id)
#         except Recipe.DoesNotExist:
#             return HttpResponse("Recipe not found", status=404)
#
#         # Create HTTP response with type: application/pdf
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = f'attachment; filename="{recipe.name}.pdf"'
#
#         # Create canvas instance
#         pdf = canvas.Canvas(response, pagesize=letter)
#         text = pdf.beginText(50, 750) # Starting position on the page (x, y)
#
#         # Set font and size
#         text.setFont("Helvetica", 12)
#
#         # Add the recipe name
#         text.textLine(f"Recipe Name: {recipe.name}")
#
#         # Add wrapped recipe description
#         if recipe.description:
#             wrapped_description = wrap(recipe.description, 80)  # Wrap text at 80 characters
#             for line in wrapped_description:
#                 text.textLine(line)
#
#         if recipe.ingredients:
#             text.textLine("\nIngredients:")
#             for ingredient in recipe.ingredients.splitlines():
#                 text.textLine(f"- {ingredient}")
#
#         # Add recipe steps
#         steps = recipe.steps.all()  # Fetch related RecipeStep objects
#         if steps.exists():
#             text.textLine("\nSteps:")
#             for step in steps:
#                 step_text = f"{step.step_number}. {step.instruction}"
#                 if step.temperature:
#                     step_text += f" (Temperature: {step.temperature}°C)"
#                 if step.time:
#                     time_in_minutes = step.time.total_seconds() // 60
#                     step_text += f" (Time: {int(time_in_minutes)} min)"
#
#                 wrapped_step_text = wrap(step_text, 80)
#                 for line in wrapped_step_text:
#                     text.textLine(line)
#
#         pdf.drawText(text)
#         pdf.showPage()
#         pdf.save()
#
#         return response

#
# class GenerateRecipePDFView(APIView):
#     """View to create PDF for single recipe"""
#
#     def get(self, request, recipe_id):
#         try:
#             # Get recipe from database
#             recipe = Recipe.objects.get(id=recipe_id)
#         except Recipe.DoesNotExist:
#             return HttpResponse("Recipe not found", status=404)
#
#         # Create HTTP response with type: application/pdf
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = f'attachment; filename="{recipe.name}.pdf"'
#
#         # Create document
#         doc = SimpleDocTemplate(response, pagesize=letter)
#         styles = getSampleStyleSheet()
#         elements = []
#
#         # Add title
#         elements.append(Paragraph(f"<b>Recipe Name:</b> {recipe.name}", styles['Title']))
#         elements.append(Spacer(1, 12))
#
#         # Add description
#         if recipe.description:
#             elements.append(Paragraph("<b>Description:</b>", styles['Heading2']))
#             elements.append(Paragraph(recipe.description, styles['BodyText']))
#             elements.append(Spacer(1, 12))
#
#         # Add ingredients
#         if recipe.ingredients:
#             elements.append(Paragraph("<b>Ingredients:</b>", styles['Heading2']))
#             ingredients_list = [[f"- {line.strip()}"] for line in recipe.ingredients.splitlines()]
#             table = Table(ingredients_list)
#             table.setStyle(TableStyle([
#                 ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
#                 ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#                 ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
#             ]))
#             elements.append(table)
#             elements.append(Spacer(1, 12))
#
#         # Add steps
#         steps = recipe.steps.all()
#         if steps.exists():
#             elements.append(Paragraph("<b>Preparation steps:</b>", styles['Heading2']))
#             for step in steps:
#                 step_details = f"{step.step_number}. {step.instruction}"
#                 if step.temperature:
#                     step_details += f" (Temperature: {step.temperature}°C)"
#                 if step.time:
#                     time_in_minutes = step.time.total_seconds() // 60
#                     step_details += f" (Time: {int(time_in_minutes)} min)"
#                 elements.append(Paragraph(step_details, styles['BodyText']))
#                 elements.append(Spacer(1, 6))
#
#         # Build PDF
#         doc.build(elements)
#
#         return response

logger = logging.getLogger(__name__)

class GenerateRecipePDFView(APIView):
    """View to create PDF for single recipe"""
    permission_classes = [IsAuthenticated]

    def get(self, request, recipe_id):
        logger.debug(f"Request for pdf: recipe_id={recipe_id}")
        try:
            # Get recipe from database
            recipe = Recipe.objects.get(id=recipe_id)
            # Set language dynamically from Accept-Language header or fallback to default
            language = request.LANGUAGE_CODE or 'en'
            recipe.set_current_language(language)
        except Recipe.DoesNotExist:
            return HttpResponse("Recipe not found", status=404)

         # Check for 'download' query parameter
        download = request.GET.get('download', 'false').lower() == 'true'
        disposition = 'attachment' if download else 'inline'

        save_filename = f"{recipe.name.replace(' ', '_')}.pdf"
        # Create HTTP response with appropriate Content-Disposition
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'{disposition}; filename="{save_filename}.pdf"'

        # Generate PDF content
        doc = SimpleDocTemplate(response, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Add recipe details (title, description, ingredients, steps)
        elements.append(Paragraph(f"<b>{_('Recipe Name')}:</b> {recipe.name}", styles['Title']))
        elements.append(Spacer(1, 12))

        # Add description
        if recipe.description:
            elements.append(Paragraph("<b>"+_('Description')+"</b>", styles['Heading2']))
            elements.append(Paragraph(recipe.description, styles['BodyText']))
            elements.append(Spacer(1, 12))

        # Add ingredients
        if recipe.ingredients:
            elements.append(Paragraph(f"<b>{_('Ingredients')}:</b>", styles['Heading2']))
            ingredients = recipe.ingredients.split(',')
            ingredients_list = [[idx + 1, ingredient.strip()] for idx, ingredient in enumerate(ingredients)]
            table = Table([[ _('Nr'), _('Ingredients') ]] + ingredients_list, colWidths=[30, 450])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.lightyellow, colors.HexColor("#FFE599")]),
            ]))
            elements.append(table)
            elements.append(Spacer(1, 12))

        # Add recipe steps
        steps = recipe.steps.all().language(language)  # Fetch related RecipeStep objects

        if steps.exists():
            elements.append(Paragraph(f"<b>{_('Steps')}:</b>", styles['Heading2']))
            for step in steps:
                step_details = f"{step.step_number}. {step.instruction}"
                if step.temperature:
                    step_details += f" ({_('Temperature')}: {step.temperature}°C)"
                if step.time:
                    time_in_minutes = step.time.total_seconds() // 60
                    step_details += f" ({_('Time')}: {int(time_in_minutes)} min)"
                elements.append(Paragraph(step_details, styles['BodyText']))
                elements.append(Spacer(1, 6))

        # Build PDF
        doc.build(elements)

        return response



# class GenerateFavoritesPDFView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
#         user = request.user
#         favorites = FavoriteRecipe.objects.filter(user=user)
#
#         response = HttpResponse(content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="FavoriteRecipes.pdf"'
#
#         # Creation of PDF
#         pdf = canvas.Canvas(response, pagesize=letter)
#         pdf.setFont("Helvetica", 12)
#         y = 750
#
#         pdf.drawString(100, y, "My Favorite Recipes")
#         y -= 20
#
#         for favorite in favorites:
#             recipe = favorite.recipe
#             pdf.drawString(100, y, f"- {recipe.name}")
#             y -= 20
#             if y < 50:   # Turn on new page
#                 pdf.showPage()
#                 y = 750
#
#         pdf.showPage()
#         pdf.save()
#         return response

class LoginView(APIView):

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate or retieve token
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email,
                'id': user.id,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Delete user's token
            request.user.auth_token.delete()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class RecipeSearchView(APIView):
    """
    API endpoint for searching and filtering recipes.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(selfself, request, *args, **kwargs):
        # Extract query parameters
        query = request.GET.get('q', '')  # Search query
        name = request.GET.get('name', None)
        type_of_dish = request.GET.get('type_of_dish', None)
        preparation_method = request.GET.get('preparation_method', None)
        difficulty_level = request.GET.get('difficulty_level', None)
        ingredient_type = request.GET.get('ingredient_type', None)
        preparation_time = request.GET.get('preparation_time', None)
        tags = request.GET.get('tags', '')
        if tags:
            tags = tags.split(',')
        favorites_only = request.GET.get('favorites', 'false') == 'true' # Only favorites

        # Base queryset
        recipe_queryset = Recipe.objects.all()
        # Dynamic filters using Q object
        filters = Q()

        if query:
            filters &= (
                 Q(name__icontains=query) |
                 Q(description__icontains=query) |
                 Q(ingredients__icontains=query)
            )

        if name:
            filters &= Q(name__icontains=name)
        if type_of_dish:
            filters &= Q(type_of_dish=type_of_dish)
        if preparation_method:
            filters &= Q(preparation_method=preparation_method)
        if difficulty_level:
            filters &= Q(difficulty_level=difficulty_level)
        if ingredient_type:
            filters &= Q(ingredient_type=ingredient_type)
        if preparation_time:
            filters &= Q(preparation_time=preparation_time)

        if tags:
            filters &= Q(tags__tag_name__in=tags)

        # Apply favorites filter if user is authenticated
        if favorites_only and request.user.is_authenticated:
            recipe_queryset = recipe_queryset.filter(user_favorites=request.user)
            # favorite_recipes_ids = request.user.favorites.values_list('recipe_id', flat=True)
            # filters &= Q(id__in=favorite_recipes_ids)

        # Filter queryset
        recipe_queryset = recipe_queryset.filter(filters).distinct().order_by('-id')
        print(recipe_queryset.query)
        print(tags)

        # Serialize results
        serializer = RecipeSerializer(recipe_queryset, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class RatingCreateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        recipe_id = self.request.data.get('recipe')
        rating_value = self.request.data.get('rating')

        if not recipe_id or not rating_value:
            raise ValueError("Recipe ID and rating are required.")

        recipe = Recipe.objects.get(id=recipe_id)

        rating, created = Rating.objects.get_or_create(
            user=self.request.user,
            recipe=recipe,
            defaults={'rating': rating_value}
        )

        if not created:
            rating.rating = rating_value  # Update rating
            rating.save()

        return rating

class RecipeRatingsView(generics.RetrieveAPIView):
    queryset = Recipe.objects.annotate(average_rating=Coalesce(Avg('ratings__rating'), Value(0.0)))
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):

        return self.queryset.get(id=self.kwargs["pk"])


        return Response({
            "total_users": total_users,
            "total_recipes": total_recipes,
            "recipe_statistics": list(stats),
        })


class GeneralStatisticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "total_recipes": Recipe.objects.count(),
            "total_users": User.objects.count(),
        }
        return Response(data, status=status.HTTP_200_OK)


class PopularRecipesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        top_rated = Recipe.objects.annotate(avg_rating=Avg('ratings__rating')).order_by('-avg_rating')[:5]
        most_commented = Recipe.objects.all().order_by('-comment_count')[:5]
        most_favorited = Recipe.objects.order_by('-favorite_count')[:5]

        data = {
            "top_rated": RecipeSerializer(top_rated, context={'request': request}, many=True).data,
            "most_commented": RecipeSerializer(most_commented, context={'request': request}, many=True).data,
            "most_favorited": RecipeSerializer(most_favorited, context={'request': request}, many=True).data,
        }
        return Response(data)