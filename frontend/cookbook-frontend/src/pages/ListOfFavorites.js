import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FavoriteRecipeNotes from "./FavoriteRecipeNotes";

const FavoriteRecipes = () => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError(t("favorites.loginRequired"));
                return;
            }

            try {
                const response = await axios.get("/api/favorites/", {
                    headers: { Authorization: `Token ${token}` },
                });
                console.log(response.data.results);
                setFavorites(response.data.results);
            } catch (error) {
                 setError(t("favorites.fetchError"));
            }
        };
        fetchFavorites();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>{t("favorites.title")}</h1>

            {favorites.length > 0 ? (
                <ul>
                    {favorites.map((recipe) => (
                        <li key={recipe.recipe_id}>
                            <h2>{recipe.recipe_name}</h2>
                            <button onClick={() => navigate(`/recipe/${recipe.recipe_id}/`)}>
                                {t("favorites.viewButton")}
                            </button>
                            {/*<FavoriteRecipeNotes*/}
                            {/*    recipeID={recipe.recipe_id}*/}
                            {/*    // initialNotes={recipe.notes}*/}
                            {/*/>*/}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t("favorites.noRecipes")}</p>
            )}
        </div>
    );
};

export default FavoriteRecipes;