// src/RecipeList.js
import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  //Enabling redirection to details
import './RecipeList.css';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);  // State to store recipes list
    const [error, setError] = useState(null);     // State to store errors
    const { t, i18n } = useTranslation();


  useEffect(() => {
      const fetchRecipes = async () => {
      try {
          const response = await axios.get('/api/recipes/');
          const detailedRecipes = await Promise.all(
              response.data.results.map(async(recipe) => {
                  const detailResponse = await axios.get(`/api/recipe/${recipe.id}/`);
                  return detailResponse.data;
                  })
          );
          console.log(response.data, response.data)
          setRecipes(detailedRecipes);
      } catch (error) {
          setError('Failed to load recipes');
          console.log(error);
      }
  };

  fetchRecipes();
}, [i18n.language]);


  return (
    <div className="recipe-list-container">
      <h1 className="recipe-list-title">{t("recipeList.recipes")}</h1>
      {error && <p className="error-message">{error}</p>}
      <ul className="recipe-list">
        {recipes.map(recipe => (
          <li key={recipe.id} className="recipe-list-item">
              <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;