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
from django.urls import path

from recipes.models import Recipe
from recipes.views import CategoryListView, CategoryDetailView, TagListView, TagDetailView, RecipeListView, \
    RecipeDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('category/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('tag/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
    path('recipes/', RecipeListView.as_view(), name='recipe-list'),
    path('recipe/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
]
