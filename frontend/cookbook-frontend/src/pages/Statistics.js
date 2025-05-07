import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React from "react";
import './Statistics.css';


const Statistics = ({ stats }) => {
    const { t } = useTranslation();
    return (
        <section className="stats-section">
            <h2>{t("statistics.title")}</h2>
            <p>{t("statistics.description", { count: stats.total_recipes} )}</p>
        </section>
    );
};

export default Statistics;