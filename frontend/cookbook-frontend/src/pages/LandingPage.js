import React, { useEffect, useState }from "react";
import axios from "axios";
import RecipeDetail from "./RecipeDetail";
import Statistics from "./Statistics";
import {Link, useNavigate} from "react-router-dom";
import "./LandingPage.css";


const LandingPage = () => {
    const [newRecipes, setNewRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total_recipes: 0 });


    useEffect(() => {
        const fetchLandingPage = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/landing_page/');
                setNewRecipes(response.data.new_recipes);
                setPopularRecipes(response.data.popular_recipes);
                setStats({ total_recipes: response.data.total_recipes });
            } catch (error) {
                console.error('Error fetching landing page data:', error);
            }
        };

        fetchLandingPage();
    }, []);

    return (
        <div className="landing-page">
            <header className="header">
                <h1>Welcome to CookBook</h1>
                <p>Your go-to place for amazing recipes!</p>
            </header>

            <Statistics stats={stats}/>

            <section className="new-recipes">
                <h2>Newest Recipes</h2>
                <div className="recipes-grid">
                    {newRecipes.map((recipe) => (
                        <Link
                             key={recipe.id}
                             to={`/recipe/${recipe.id}/`}
                             className="recipe-link"
                        >
                            {recipe.name}  {/* display recipe name */}
                        </Link>
                    ))}
                </div>
            </section>

            <section className="popular-recipes">
                <h2>Popular Recipes</h2>
                <div className="recipes-grid">
                    {popularRecipes.map((recipe) => (
                        // <RecipeDetail key={recipe.id} recipe={recipe.name}/>
                        <Link
                             key={recipe.id}
                             to={`/recipe/${recipe.id}/`}
                             className="recipe-link"
                        >
                            {recipe.name}  {/* display recipe name */}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};


export default LandingPage;