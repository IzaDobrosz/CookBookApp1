import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminStats = () => {
    const [stats, setStats] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/admin/stats/", {
                    headers: {Authorization: `Token ${token}`},
                });
                setTotalUsers(response.data.total_users);
                setTotalRecipes(response.data.total_recipes);
                setStats(response.data);
            } catch (err) {
                setError("Loading statistics failed.");
                console.error(err);
            }
        };

        fetchStats();
    }, []);
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>📊 Statistics for Admin</h2>
            <p><strong>👤 Number of users:</strong> {totalUsers}</p>
            <p><strong>🍽️ Number of recipes:</strong> {totalRecipes}</p>

            <h3>📌 Recipes statistics:</h3>
            <table>
                <thead>
                    <tr>
                        <th>📖 Recipe</th>
                        <th>👀 Displays</th>
                        <th>⭐ Number of ratings</th>
                        <th>📊 Average rating</th>
                        <th>❤️ Favorites</th>
                        <th>💬 Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => (
                        <tr key={index}>
                            <td>{stat.recipe__name}</td>
                            <td>{stat.views}</td>
                            <td>{stat.ratings_count}</td>
                            <td>{stat.average_rating.toFixed(1)}</td>
                            <td>{stat.favorite_count}</td>
                            <td>{stat.comment_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminStats;