import React, { useState } from "react";
import axios from "axios";
import favoriteIcon from "../assets/icons/favoriteIcon.svg";

const Recipe = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.delete(`/favories/${recipe.id}/`); //Delete from favorites
            } else {
                await axios.post(`favorites/`, { recipe: recipe.id }); // Add to favorites
            }
            setIsFavorite(!isFavorite);  // Update state
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    return (
        <div className="recipe">
            <h3>{recipe.name}</h3>
            <img src={recipe.image_url} alt={recipe.name} />
            <button onClick={toggleFavorite}>
                <img
                    src={favoriteIcon}
                    alt="Favorite"
                    className={isFavorite ? "favorited" : ""}
                />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
        </div>
    );
};

export default Recipe;