import React, { useEffect, useState } from "react";
import axios from "axios";

const RateRecipe = ({ recipeId }) => {
    const [rating, setRating] = useState(0);
    const [recipe, setRecipe] = useState({ average_rating: 0 });
    const [message, setMessage] = useState("");


    const fetchRecipe = async () => {
        const token = localStorage.getItem('token');
        // if (!token) {
        //     setError("You need to log in to view your favorites.");
        //     return;
        // }
        try {
            const response = await axios.get(`/api/recipe/${recipeId}/`, {
                headers: {Authorization: `Token ${token}`},
            });
            setRecipe(response.data);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    useEffect(() => {
        fetchRecipe();
        }, [recipeId]);

    const handleRatingSubmit = async (newRating) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Please log in to rate the recipe.");
            return;
        }

        try {
            await axios.post(
                "/api/rating/",
                { recipe: recipeId, rating: newRating },
                { headers: { Authorization: `Token ${token}` } }
            );
            setRating(newRating);
            setMessage("Rating saved!");
            fetchRecipe();
        } catch (error) {
            console.error("Error rating recipe:", error);
            setMessage("Your rating was not saved.");
        }
    };

    return (
        <div className="rating-section">
            <h3>Rate recipe</h3>
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? "star selected" : "star"}
                        onClick={() => handleRatingSubmit(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
            {/*{recipe && <p>Average rating: {recipe.average_rating.toFixed(1)} ⭐ ({recipe.average_rating}/5)</p>}*/}
            {recipe && recipe.average_rating !== null ? (
                <p>Average rating: {recipe.average_rating.toFixed(1)} ⭐ ({recipe.average_rating}/5)</p>
            ) : (
                <p>Average rating: No ratings yet.</p>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default RateRecipe;