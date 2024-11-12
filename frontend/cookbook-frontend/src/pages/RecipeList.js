// src/RecipeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  //Enabling redirection to details

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);  // State to store recipes list
  const [error, setError] = useState(null);     // State to store errors

  useEffect(() => {
      const fetchRecipes = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/recipes/');
          const detailedRecipes = await Promise.all(
              response.data.results.map(async(recipe) => {
                  const detailResponse = await axios.get(`http://127.0.0.1:8000/recipe/${recipe.id}/`);
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
}, []);


  return (
    <div>
      <h1>Recipes</h1>
      {error && <p>{error}</p>}
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;