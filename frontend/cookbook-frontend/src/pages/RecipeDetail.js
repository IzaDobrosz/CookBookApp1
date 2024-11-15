// src/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom'; // Access to the URL params
import { ClockIcon, UserGroupIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import './RecipeDetail.css';
import recipeStep from "./RecipeStep";

const RecipeDetail = () => {
  const params = useParams(); // Access to ID from URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);  // State to store recipe details
  const [error, setError] = useState(null);     // State to store errors

  useEffect(() => {
      const fetchRecipe = async () => {
          try {
              const response = await axios.get(`http://127.0.0.1:8000/recipe/${params.id}/`);
              console.log(response.data, response.data)
              setRecipe(response.data);
          } catch (error) {
              setError('Failed to load recipe');
              console.log(error);
          }
      };

      fetchRecipe();
  }, [params.id]);

  if (error) {
      return <p>{error}</p>;
  }

  if (!recipe) {
      return <p>Loading ...</p>;
  }
    // Function to serve "Start cooking button"
    const handleStartCooking = () => {
      navigate('/recipe/${params.id}/steps/1');
    };

return (
    <div className="recipe-detail-container">
        <img
            src={recipe.image || 'default-recipe-image.jpg'}
            alt={recipe.name}
            className="recipe-image"
        />

        <h1 className="recipe-name">{recipe.name}</h1>
        <p className="recipe-description">{recipe.description}</p>

        {/* Pasek z ikonami i parametrami w jednej linii */}
        <div className="recipe-info-bar">
            <div className="recipe-info-item">
                <ClockIcon className="icon-small"/>
                <span><strong>Prep Time:</strong> {recipe.prep_time} min</span>
            </div>
            <div className="recipe-info-item">
                <ClockIcon className="icon-small"/>
                <span><strong>Total Time:</strong> {recipe.total_time} min</span>
            </div>
            <div className="recipe-info-item">
                <UserGroupIcon className="icon-small"/>
                <span><strong>Servings:</strong> {recipe.servings}</span>
            </div>
            <div className="recipe-info-item">
                <WrenchScrewdriverIcon className="icon-small"/>
                <span><strong>Tools:</strong> {recipe.tools}</span>
            </div>
        </div>

        {/* Ingredients */}
        <div className="ingredients-section">
            <h2 className="section-title">Ingredients</h2>
            <ul className="ingredients-list">
                {recipe.ingredients.split(',').map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                        {ingredient.trim()}
                    </li>
                ))}
            </ul>
        </div>

        {/*<h2 className="section-title">Instructions</h2>*/}
        {/*<ol className="list-decimal">*/}
        {/*    {recipe.preparation_steps.split('.').map((step, index) => (*/}
        {/*        <li key={index}>{step.trim()}</li>*/}
        {/*    ))}*/}
        {/*</ol>*/}

        {/*button to redirect*/}
        <div className="instructions-section">
            <h2 className="section-title">Instructions</h2>
            <ol className="list-decimal">
                {recipeStep.step_details.map((step, index) => (
                    <li key={index}>{step.instruction}</li>
                ))}
            </ol>
            <button className="start-cooking-btn" onClick={handleStartCooking}>
                Start Cooking
            </button>
        </div>

        {/*<div className="mb-4">*/}
        {/*  <p><strong>Type of Dish:</strong> {recipe.type_of_dish}</p>*/}
        {/*  <p><strong>Preparation Method:</strong> {recipe.preparation_method}</p>*/}
        {/*  <p><strong>Ingredient Type:</strong> {recipe.ingredient_type}</p>*/}
        {/*  <p><strong>Preparation Time Category:</strong> {recipe.preparation_time}</p>*/}
        {/*  /!*<p><strong>Difficulty Level:</strong> {recipe.difficulty_level}</p>*!/*/}
        {/*</div>*/}

        <div className="dates-bar">
            <div className="recipe-info-item">
                <span><strong>Created On:</strong> {new Date(recipe.created_on).toLocaleDateString()}</span>
            </div>
            <div className="recipe-info-item">
                <span><strong>Updated On:</strong> {new Date(recipe.updated_on).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="tags-section">
            <strong>Tags:</strong>
            <div className="recipe-tags">
                {recipe.tags && recipe.tags.length > 0 ? (
                    recipe.tags.map(tag => (
                        <span
                            key={tag.id}
                            style={{backgroundColor: tag.tag_color}}
                            className="tag-item"
                        >
          {tag.tag_name}
        </span>
                    ))
                ) : (
                    <p>No tags available</p>
                )}
            </div>
        </div>
    </div>
);
};

export default RecipeDetail;