"""
URL configuration for cook_book project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path
from django.views.generic import TemplateView

from recipes.models import Recipe
from recipes.views import TagListView, TagDetailView, RecipeListView, RecipeDetailView, RecipeStepDetailView, \
    RecipeAllStepsListView, CommentListCreateView, LandingPageView, GenerateRecipePDFView, \
    LoginView, LogoutView, RecipeSearchView, CommentDetailView, AddToFavoriteView, \
    RemoveFromFavoriteView, FavoriteRecipesListView, RecipeNotesView, RatingCreateView, RecipeRatingsView
from recipes import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tags/', TagListView.as_view(), name='tag-list'),
    path('api/tag/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
    path('api/recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('api/recipe/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('api/recipe/<int:recipe_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('api/recipe/<int:recipe_id>/comments/<int:comment_id>/', CommentDetailView.as_view(), name='comment-details'),
    path('api/recipe/<int:recipe_id>/steps/<int:step>/', RecipeStepDetailView.as_view(), name='recipe_step_detail'),
    path('api/recipe/<int:recipe_id>/steps/', RecipeAllStepsListView.as_view(), name='recipe_steps'),
    path('api/users/', views.UserList.as_view(), name='user-list'),
    path('api/users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('api/landing_page/', LandingPageView.as_view(), name='landing_page_data'),
    path('api/favorites/', FavoriteRecipesListView.as_view(), name='favorites-list'),
    path('api/favorites/<int:recipe_id>/', AddToFavoriteView.as_view(), name='add_to_favorites'),
    path('api/favorites/<int:recipe_id>/remove/', RemoveFromFavoriteView.as_view(), name='remove_from_favorites'),
    path('api/notes/<int:recipe_id>/', RecipeNotesView.as_view(), name='recipe-notes'),
    path('api/recipe/<int:recipe_id>/pdf/', GenerateRecipePDFView.as_view(), name='generate_recipe_pdf'),
    # path('api/favorites/pdf/', GenerateFavoritesPDFView.as_view(), name='generate_favorites_pdf'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/recipes/search/', RecipeSearchView.as_view(), name='recipe_search'),
    path('', TemplateView.as_view(template_name='index.html')),   #fallback view for React
    path('api/', views.api_root),
    path('api/rating/', RatingCreateView.as_view(), name='rate-recipe'),
    path('api/recipe/<int:recipe_id>/ratings/', RecipeRatingsView.as_view(), name='recipe-ratings'),
]
