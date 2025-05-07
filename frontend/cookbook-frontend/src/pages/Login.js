import '../i18n/i18n';
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext"; // Import AuthContext
import "./Login.css";
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext); // Wyciągamy funkcję setUser z AuthContext
    const { t, i18n } = useTranslation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login/", {
                username,
                password,
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", response.data.id);
            localStorage.setItem("username", response.data.username);

            // Set user in AuthContext
            setUser({
                username: response.data.username,
                id: response.data.id,
            });

            alert(t("loginPage.success"));
            navigate("/landing_page/");
        } catch (err) {
            setError(t("loginPage.error"));
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>{t("loginPage.title")}</h2>
                {error && <p className="error-message">{error}</p>}
                <label>
                     {t("loginPage.username")}:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                     {t("loginPage.password")}:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{t("loginPage.submit")}</button>
            </form>
        </div>
    );
};

export default Login;