import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [popular, setPopular] = useState(null);
    const { t, i18n } = useTranslation();

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
    }, [i18n.language]);

    return (
        <div className="dashboard">
            <h2>{t("dashboard.statsTitle")}</h2>
            {stats ? (
                <div className="stats-box">
                    <div className="stat-item">
                        <h3>{t("dashboard.totalRecipes")}</h3>
                        <p>{stats.total_recipes}</p>
                    </div>
                    <div className="stat-item">
                        <h3>{t("dashboard.totalUsers")}</h3>
                        <p>{stats.total_users}</p>
                    </div>
                </div>
            ) : <p>{t("dashboard.loadingStats")}</p>}

            <h2>{t("dashboard.popularTitle")}</h2>
            {popular ? (
                <div className="recipes-container">
                    <div>
                        <h3>{t("dashboard.highestRated")}</h3>
                        <ul>
                            {popular.top_rated.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.avg_rating}⭐</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>{t("dashboard.mostCommented")}</h3>
                        <ul>
                            {popular.most_commented.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.comment_count} 💬</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>{t("dashboard.mostFavorited")}</h3>
                        <ul>
                            {popular.most_favorited.map(recipe => (
                                <li key={recipe.id}>{recipe.name} - {recipe.favorite_count} ❤️</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : <p>{t("dashboard.loadingPopular")}</p>}
        </div>
    );
};

export default Dashboard;
