import React from "react";
import './Statistics.css';


const Statistics = ({ stats }) => {
    return (
        <section className="stats-section">
            <h2>Discover Cooking</h2>
            <p>We have over {stats.total_recipes} recipes waiting for you!</p>
        </section>
    );
};

export default Statistics;