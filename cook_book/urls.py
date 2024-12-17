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

from recipes.models import Recipe
from recipes.views import TagListView, TagDetailView, RecipeListView, RecipeDetailView, RecipeStepDetailView, \
    RecipeAllStepsListView, CommentListCreateView, LandingPageView, FavoriteRecipesView, GenerateRecipePDFView, \
    LoginView, LogoutView
from recipes import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('tag/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
    path('recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('recipe/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipe/<int:recipe_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('recipe/<int:recipe_id>/steps/<int:step>/', RecipeStepDetailView.as_view(), name='recipe_step_detail'),
    path('recipe/<int:recipe_id>/steps/', RecipeAllStepsListView.as_view(), name='recipe_steps'),
    path('', views.api_root),
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('', LandingPageView.as_view(), name='landing_page_data'),
    path('favorites/', FavoriteRecipesView.as_view(), name='favorite_recipes'),
    path('recipe/<int:recipe_id>/pdf/', GenerateRecipePDFView.as_view(), name='generate_recipe_pdf'),
    # path('favorites/pdf/', GenerateFavoritesPDFView.as_view(), name='generate_favorites_pdf'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

]
