// import React, { useState, useEffect } from "react";
// import axios from "axios";
//
//
// const FavoriteButton = ({ recipeId, token }) => {
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [message, setMessage] = useState("");
//
//     useEffect(() => {
//         if (!token) return;
//         // Sprawdzenie, czy przepis jest w ulubionych
//         const checkFavoriteStatus = async () => {
//             try {
//                 const response = await axios.get(`/api/favorites/${recipeId}/`, {
//                     headers: { Authorization: `Token ${token}` }
//                 });
//                 setIsFavorite(response.data.is_favorite);
//             } catch (error) {
//                 console.error("Error checking favorite status:", error);
//             }
//         };
//
//         checkFavoriteStatus();
//     }, [recipeId, token]);
//
//     const handleFavoriteToggle = async () => {
//         if (!token) {
//             setMessage("You need to login to add to favorites.");
//             return;
//         }
//
//         try {
//             if (isFavorite) {
//                 await axios.delete(`/api/favorites/${recipeId}/`, {
//                     headers: { Authorization: `Token ${token}` },
//                 });
//                 setIsFavorite(false);
//                 setMessage("Removed from favorites.");
//             } else {
//                 await axios.post(`/api/favorites/${recipeId}/`, {}, {
//                     headers: { Authorization: `Token ${token}` },
//                 });
//                 setIsFavorite(true);
//                 setMessage("Added to favorites.");
//             }
//         } catch (error) {
//             setMessage("Error: " + (error.response?.data?.message || error.message));
//         }
//     };
//
//     return (
//         <div>
//             <button onClick={handleFavoriteToggle}>
//                 {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
//             </button>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };
//
// export default FavoriteButton;


import React, { useState } from "react";
import axios from "axios";

const FavoriteButton = ({ recipeId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [message, setMessage] = useState("");

    const handleFavoriteToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("You need to login to add to favorites.")
            return;
        }

        try {
            if (isFavorite) {
                await axios.delete(`/api/favorites/${recipeId}/remove/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setIsFavorite(false);
                setMessage("Removed from favorites.");
            } else {
                await axios.post( `/api/favorites/${recipeId}/`, {},
                { headers: { Authorization: `Token ${token}` } }
                );
                setIsFavorite(true);
                setMessage("Added to favorites.");
            }
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <button onClick={handleFavoriteToggle}>
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FavoriteButton;





// import React, { useState } from "react";
// import axios from "axios";
// import favoriteIcon from "../assets/icons/favoriteIcon.svg";
//
// const Recipe = ({ recipe }) => {
//     const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
//
//     const toggleFavorite = async () => {
//         try {
//             if (isFavorite) {
//                 await axios.delete(`/api/favories/${recipe.id}/`); //Delete from favorites
//             } else {
//                 await axios.post(`/api/favorites/`, { recipe: recipe.id }); // Add to favorites
//             }
//             setIsFavorite(!isFavorite);  // Update state
//         } catch (err) {
//             console.error("Error toggling favorite:", err);
//         }
//     };
//
//     return (
//         <div className="recipe">
//             <h3>{recipe.name}</h3>
//             <img src={recipe.image_url} alt={recipe.name} />
//             <button onClick={toggleFavorite}>
//                 <img
//                     src={favoriteIcon}
//                     alt="Favorite"
//                     className={isFavorite ? "favorited" : ""}
//                 />
//                 {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
//             </button>
//         </div>
//     );
// };
//
// export default Recipe;