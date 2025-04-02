import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeDetail from "./RecipeDetail";
import Statistics from "./Statistics";
import { Link, useNavigate} from "react-router-dom";
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

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import "./LandingPage.css";
//
// const LandingPage = () => {
//     const [newRecipes, setNewRecipes] = useState([]);
//     const [popularRecipes, setPopularRecipes] = useState([]);
//     const [stats, setStats] = useState(null);
//     const [popular, setPopular] = useState(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const landingResponse = await axios.get("http://127.0.0.1:8000/api/landing_page/");
//                 setNewRecipes(landingResponse.data.new_recipes);
//                 setPopularRecipes(landingResponse.data.popular_recipes);
//
//                 const statsResponse = await axios.get("http://127.0.0.1:8000/api/statistics/");
//                 setStats(statsResponse.data);
//
//                 const popularResponse = await axios.get("http://127.0.0.1:8000/api/popular-recipes/");
//                 setPopular(popularResponse.data);
//             } catch (error) {
//                 console.error("Error fetching landing page data:", error);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     return (
//         <div className="landing-page">
//             <header className="header">
//                 <h1>🍳 Welcome to CookBook</h1>
//                 <p>Your go-to place for amazing recipes!</p>
//             </header>
//
//             {/* Sekcja statystyk */}
//             <section className="statistics-section">
//                 {stats ? (
//                     <div className="stats-box">
//                         <div className="stat-item">
//                             <h3>📌 Liczba przepisów</h3>
//                             <p>{stats.total_recipes}</p>
//                         </div>
//                         <div className="stat-item">
//                             <h3>👥 Liczba użytkowników</h3>
//                             <p>{stats.total_users}</p>
//                         </div>
//                     </div>
//                 ) : <p>Ładowanie statystyk...</p>}
//             </section>
//
//             {/* Sekcja najnowszych przepisów */}
//             <section className="new-recipes">
//                 <h2>🆕 Newest Recipes</h2>
//                 <div className="recipes-grid">
//                     {newRecipes.map((recipe) => (
//                         <Link key={recipe.id} to={`/recipe/${recipe.id}/`} className="recipe-link">
//                             {recipe.name}
//                         </Link>
//                     ))}
//                 </div>
//             </section>
//
//             {/* Sekcja popularnych przepisów */}
//             <section className="popular-recipes">
//                 <h2>🔥 Popular Recipes</h2>
//                 {popular ? (
//                     <div className="recipes-container">
//                         <div>
//                             <h3>⭐ Highest Rated</h3>
//                             <ul>
//                                 {popular.top_rated.map(recipe => (
//                                     <li key={recipe.id}>{recipe.name} - {recipe.avg_rating}⭐</li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div>
//                             <h3>💬 Most Commented</h3>
//                             <ul>
//                                 {popular.most_commented.map(recipe => (
//                                     <li key={recipe.id}>{recipe.name} - {recipe.comment_count} 💬</li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div>
//                             <h3>❤️ Most Favorited</h3>
//                             <ul>
//                                 {popular.most_favorited.map(recipe => (
//                                     <li key={recipe.id}>{recipe.name} - {recipe.favorite_count} ❤️</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 ) : <p>Ładowanie popularnych przepisów...</p>}
//             </section>
//         </div>
//     );
// };
//
// export default LandingPage;