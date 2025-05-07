import '../i18n/i18n';
import React from "react";
import axios from "axios";
import "./Logout.css";
import { useTranslation } from 'react-i18next';

const Logout = () => {
    const { t, i18n } = useTranslation();
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "/api/logout/",
                {},
                { headers : { Authorization: `Token ${token}`}}
            );
            localStorage.removeItem("token");
            alert(t("logout.success"));  //"Logged out successfully!"
        } catch (err) {
            alert(t("logout.error"));  //"Something went wrong"
        }
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            {t("logout.button")} //Logout
        </button>
    );
};

export default Logout;