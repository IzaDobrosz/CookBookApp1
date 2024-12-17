// src/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom'; // Access to the URL params
import { ClockIcon, UserGroupIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { RecipePDFButton } from "./PdfWithRecipe";
import './RecipeDetail.css';



const RecipeDetail = () => {
    const params = useParams(); // Access to ID from URL
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);  // State to store recipe details
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);     // State to store errors
    const [showComments, setShowComments] = useState(false);  // For expanding the comment section
    const [showAddComment, setAddComment] = useState(false);

    const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

    useEffect(() => {
        if (!params.id) { // Sprawdza, czy 'id' jest obecne w URL
        setError('Recipe ID not found in URL.');
        return;
        }
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

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${params.id}/comments/`);
                setComments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecipe();
        fetchComments();
    }, [params.id]);


    const handleShowComments = () => {
        navigate(`/recipe/${params.id}/comments`);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;   // Avoid submitting empty comments
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/recipe/${params.id}/comments/`,
                {comment: newComment},
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}  // Use your auth token method
            );
            setComments([...comments, response.data]);  // Update comments list
            setNewComment('');    // Clear the input field
            setAddComment(false);   // Hide the input field after submission
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    //  // Function to toggle visibility of comments
    // const toggleComments = () => setShowComments(!showComments);


    if (error) {
        return <p>{error}</p>;
    }

    if (!recipe) {
        return <p>Loading ...</p>;
    }
    // Function to serve "Start cooking button"
    const handleStartCooking = () => {
        navigate(`/recipe/${params.id}/steps/1`);
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

            {/* Comments Section */}
            <div className="comments-section">
                <div className="comments-actions">
                    <button onClick={handleShowComments}>Show Comments</button>
                    {isLoggedIn && (
                        <button onClick={() => setAddComment(!showAddComment)}>
                            {showAddComment ? 'Cancel' : 'Add comment'}
                        </button>
                    )}
                </div>

                {showComments && (
                    <div>
                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        <p>
                                            <strong>{comment.user}</strong> on {new Date(comment.created_on).toLocaleDateString()}
                                        </p>
                                        <p>{comment.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet</p>
                            )}
                        </div>

                        {/* Add a Comment */}
                        {showAddComment && (
                            <div className="add-comment">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                    className="add-comment-textarea"
                                />
                                <button onClick={handleAddComment} className="send-comment-btn">
                                    Send comment
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
