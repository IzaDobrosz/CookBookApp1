from ast import Index
from http.client import responses
from http.cookiejar import logger
from pydoc import resolve
from textwrap import wrap

from django.contrib.auth import authenticate
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
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
from .models import Tag, Recipe, User, RecipeStep, Comment
from .serializers import TagSerializer, RecipeSerializer, UserSerializer, RecipeStepSerializer, CommentSerializer
from datetime import timedelta

import logging

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
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    # Allow unauthenticated users to view, authenticated to post

    def get_queryset(self):
        recipe_id = self.kwargs['recipe_id']      # Take ID of recipe from URL
        return Comment.objects.filter(recipe_id=recipe_id)    #Filter comments for certain recipe


    def list(self, request, *args, **kwargs):
        # function overriding list method to modify API response
        # and include recipe-name from other model
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        recipe = Recipe.objects.get(id=self.kwargs.get('recipe_id'))  # Get recipe
        return Response({
            'recipe_name': recipe.name,
            'comments': serializer.data
        })


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)    # Save the current user who posted the comment


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
        popular_recipes = Recipe.objects.all()[:5]   # ten kod do POPRAWY JAK BEDA STATISTIC
        # Count all recipes
        recipe_count = Recipe.objects.count()

        # Prepare data for the response
        data = {
            "new_recipes": RecipeSerializer(new_recipes, many=True, context={'request': request}).data,    # Serializacja
            "popular_recipes": RecipeSerializer(popular_recipes, many=True, context={'request': request}).data,
            "total_recipes": recipe_count,
        }
        return Response(data)


class FavoriteRecipesView(APIView):
    "View to save favorite recipes"
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        favorite_recipes = user.favorite_recipes.all()    # Get all favorite recipes of user
        serializer = RecipeSerializer(favorite_recipes, many=True)
        return Response(serializer.data)


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


    def get(self, request, recipe_id):
        logger.debug(f"Request for pdf: recipe_id={recipe_id}")
        try:
            # Get recipe from database
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return HttpResponse("Recipe not found", status=404)

         # Check for 'download' query parameter
        download = request.GET.get('download', 'false').lower() == 'true'
        disposition = 'attachment' if download else 'inline'

        # Create HTTP response with appropriate Content-Disposition
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'{disposition}; filename="{recipe.name}.pdf"'

        # Generate PDF content
        doc = SimpleDocTemplate(response, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Add recipe details (title, description, ingredients, steps)
        elements.append(Paragraph(f"<b>Recipe Name:</b> {recipe.name}", styles['Title']))
        elements.append(Spacer(1, 12))

        # Add description
        if recipe.description:
            elements.append(Paragraph("<b>Description:</b>", styles['Heading2']))
            elements.append(Paragraph(recipe.description, styles['BodyText']))
            elements.append(Spacer(1, 12))

        # Add ingredients
        if recipe.ingredients:
            elements.append(Paragraph("<b>Ingredients:</b>", styles['Heading2']))
            ingredients = recipe.ingredients.split(',')
            ingredients_list = [[idx + 1, ingredient.strip()] for idx, ingredient in enumerate(ingredients)]
            table = Table([['Nr', 'Ingredients']] + ingredients_list, colWidths=[30, 450])
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
        steps = recipe.steps.all()  # Fetch related RecipeStep objects
        if steps.exists():
            elements.append(Paragraph("<b>Steps:</b>", styles['Heading2']))
            for step in steps:
                step_details = f"{step.step_number}. {step.instruction}"
                if step.temperature:
                    step_details += f" (Temperature: {step.temperature}°C)"
                if step.time:
                    time_in_minutes = step.time.total_seconds() // 60
                    step_details += f" (Time: {int(time_in_minutes)} min)"
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

