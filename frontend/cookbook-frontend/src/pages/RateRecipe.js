import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from "react";
import axios from "axios";

const RateRecipe = ({ recipeId }) => {
    const [rating, setRating] = useState(0);
    const [recipe, setRecipe] = useState({ average_rating: 0 });
    const [message, setMessage] = useState("");
    const { t, i18n } = useTranslation();


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
        }, [recipeId, i18n.language]);

    const handleRatingSubmit = async (newRating) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage(t("rateRecipe.login_message"));
            return;
        }

        try {
            await axios.post(
                "/api/rating/",
                { recipe: recipeId, rating: newRating },
                { headers: { Authorization: `Token ${token}` } }
            );
            setRating(newRating);
            setMessage(t("rateRecipe.success_message"));
            fetchRecipe();
        } catch (error) {
            console.error("Error rating recipe:", error);
            setMessage(t("rateRecipe.failure-message"));
        }
    };

    return (
        <div className="rating-section">
            <h3>{t("rateRecipe.heading")}</h3>
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
                // <p>Average rating: {recipe.average_rating.toFixed(1)} ⭐ ({recipe.average_rating}/5)</p>
                <p>{t("rateRecipe.average_rating", { rating: recipe.average_rating.toFixed(1) })}</p>
            ) : (
                <p>{t("rateRecipe.no_ratings")}</p>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default RateRecipe;