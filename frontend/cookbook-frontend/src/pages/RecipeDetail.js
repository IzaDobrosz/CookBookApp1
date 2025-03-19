// src/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Access to the URL params
import { ClockIcon, UserGroupIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { RecipePDFButton } from "./PdfWithRecipe";
import FavoriteButton from './SetFavoriteRecipe';
// import FavoriteRecipeNotes from './FavoriteRecipeNotes'; // Import the FavoriteRecipeNotes component
import './RecipeDetail.css';
import RateRecipe from "./RateRecipe";

const RecipeDetail = () => {
    const params = useParams(); // Access to ID from URL
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);  // State to store recipe details
    const [error, setError] = useState(null);     // State to store errors
    const [notes, setNotes] = useState(''); // State to manage notes
    const [isFavorite, setIsFavorite] = useState(false); // State to check if the recipe is a favorite

    useEffect(() => {
        if (!params.id) { // Sprawdza, czy 'id' jest obecne w URL
        setError('Recipe ID not found in URL.');
        return;
        }

        // Fetch recipe details
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`/api/recipe/${params.id}/`);
                console.log(response.data, response.data)
                setRecipe(response.data);
            } catch (error) {
                setError('Failed to load recipe');
                console.error(error);
            }
        };

        // Check if recipe is a favorite and fetch notes
        const fetchFavoriteDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Token not found in localStorage');
                return;
            }

            if (!params.id) {
                console.error('Recipe ID is undefined.');
                return;
            }

            try {
                const response = await axios.get(`/api/notes/${params.id}/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                if (response.status === 200) {
                    setIsFavorite(true);
                    setNotes(response.data.notes || ''); // Fetch existing notes
                }
            } catch (error) {
                console.error('Failed to fetch favorite details:', error);
                setIsFavorite(false);  // Recipe not favorite=>hide notes
            }
        };

        fetchRecipe();
        fetchFavoriteDetails();
    }, [params.id]);

    const handleSaveNotes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to save notes.');
            return;
        }

        try {
            await axios.post(`/api/notes/${params.id}/`, { notes }, {
                headers: { Authorization: `Token ${token}` },
            });
            alert('Notes saved successfully!');
        } catch (error) {
            console.error('Failed to save notes:', error);
            alert('Failed to save notes.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!recipe) {
        return <p>Loading ...</p>;
    }
    // Function to serve "Start cooking button"
    const handleStartCooking = () => {
        navigate(`/recipe/${params.id}/steps/1/`);
    };

    return (
        <div className="recipe-detail-container">
            <img
                src={recipe.image || 'default-recipe-image.jpg'}
                alt={recipe.name}
                className="recipe-image"
            />
            <h1 className="recipe-name">{recipe.name}</h1>
            {/* Button to download recipe PDF */}
            {recipe && <RecipePDFButton recipeId={params.id} />}

            {/* Dodaj przycisk ulubionych */}
            <FavoriteButton recipeId={recipe.id} />

            <p className="recipe-description">{recipe.description}</p>

            <div>
            {/* Rating */}
            <RateRecipe recipeId={params.id} />

            </div>

            {/* Pasek z ikonami i parametrami w jednej linii */}
            <div className="recipe-info-bar">
                <div className="recipe-info-item">
                    <ClockIcon className="icon-small" />
                    <span><strong>Prep Time:</strong> {recipe.prep_time} min</span>
                </div>
                <div className="recipe-info-item">
                    <ClockIcon className="icon-small" />
                    <span><strong>Total Time:</strong> {recipe.total_time} min</span>
                </div>
                <div className="recipe-info-item">
                    <UserGroupIcon className="icon-small" />
                    <span><strong>Servings:</strong> {recipe.servings}</span>
                </div>
                <div className="recipe-info-item">
                    <WrenchScrewdriverIcon className="icon-small" />
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

            <h2 className="section-title">Instructions</h2>
            <ol className="list-decimal">
                {recipe.preparation_steps.split('.').map((step, index) => (
                    <li key={index}>{step.trim()}</li>
                ))}
            </ol>

            {/*button to redirect*/}
            <div className="instructions-section">
                <h2 className="section-title">Press below to see details</h2>
                {/*<ol className="list-decimal">*/}
                {/*    {recipeStep.map((step, index) => (*/}
                {/*        <li key={index}>{step.instruction}</li>*/}
                {/*    ))}*/}
                {/*</ol>*/}
                <button className="start-cooking-btn" onClick={handleStartCooking}>
                    Start Cooking
                </button>
            </div>

            {/* Dynamic Notes Section */}
            {isFavorite && (
                <div className="notes-section">
                    <h2 className="section-title">Your notes</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes here ..."
                        className="notes-textarea"
                    />
                    <button onClick={handleSaveNotes} className="save-notes-btn">
                        Save Notes
                    </button>
                </div>
            )}


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
                                style={{ backgroundColor: tag.tag_color}}
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

            <button onClick={() => navigate(`/recipe/${params.id}/comments/`)} className="comments-button">
                View and Manage Comments
            </button>
        </div>
    );
};

export default RecipeDetail;