import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [popular, setPopular] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, popularResponse] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/statistics/"),
                    axios.get("http://127.0.0.1:8000/api/popular-recipes/")
                ]);

                setStats(statsResponse.data);
                setPopular(popularResponse.data);
            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard">
            <h2>📊 Statistics</h2>
            {stats ? (
                <div className="stats-box">
                    <div className="stat-item">
                        <h3>📌 Total Recipes</h3>
                        <p>{stats.total_recipes}</p>
                    </div>
                    <div className="stat-item">
                        <h3>👥 Total Users</h3>
                        <p>{stats.total_users}</p>
                    </div>
                </div>
            ) : <p>Loading statistics...</p>}

            <h2>🔥 Most Popular Recipes</h2>
            {popular ? (
                <div className="recipes-container">
                    <div>
                        <h3>⭐ Highest Rated</h3>
                        <ul>
                            {popular.top_rated.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.avg_rating}⭐</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>💬 Most Commented</h3>
                        <ul>
                            {popular.most_commented.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.comment_count} 💬</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>❤️ Most Favorited</h3>
                        <ul>
                            {popular.most_favorited.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.favorite_count} ❤️</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : <p>Loading popular recipes...</p>}
        </div>
    );
};

export default Dashboard;
