import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './Comments.css';

const Comments = () => {
    const { recipeId } = useParams();
    const  navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [recipeName, setRecipeName] = useState("");  //Add state for name of recipe
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipeId}/comments/`);
                setComments(response.data.comments);
                setRecipeName(response.data.recipe_name);  // Set recipe name
            } catch (error) {
                setError('Failed to load comments');
                console.error(error);
            }
        };

        fetchComments();
    }, [recipeId]);

    if (error){
        return <p>{error}</p>;
    }

    return(
        <div className="comments-page">
            <button onClick={() => navigate(`/recipe/${recipeId}`)} className="back-button">
            Back to recipe details
            </button>
            <h1>Comments for: {recipeName}</h1>
            {comments.length > 0 ? (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <p>{comment.user} on {new Date(comment.created_on).toLocaleDateString()}</p>
                            <p>{comment.comment}</p>
                        </div>
                        ))}
                </div>
            ) : (
                <p>No comments available for this recipe.</p>
            )}
        </div>
    );
};

export default Comments;