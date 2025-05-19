import '../i18n/i18n';
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext"; // Import AuthContext
import "./Layout.css";
import { useTranslation } from 'react-i18next';
import { updateLanguageHeader } from "./axiosConfig";

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()


    const handleLogoutClick = async () => {
        try {
            await logout();
            navigate("/login/");
        } catch {
            alert("Logout failed. Please try again later.");
        }
    };

    // Change of language
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);      // changein i18next
        updateLanguageHeader(lang);     // update axios + localStorage
    };

    return (
        <div className="layout">
            {/* Upper navigation bar */}
            <header className="header">
                <div className="logo">
                    <img src="/images/logo_cookbook1.png" alt="CookBook Logo" className="logo-img"/>
                    {/*<Link to="/landing-page/">CookBook</Link>*/}
                </div>
                <nav className="nav">
                    <Link to="/landing_page/">{t("layout.nav.home")}</Link>
                    <Link to="/recipes/">{t("layout.nav.recipes")}</Link>
                    <Link to="/favorites/">{t("layout.nav.favorites")}</Link>
                    {/*<Link to="/login/">Login</Link>*/}
                    {/*<Link to="/logout/">Logout</Link>*/}
                    <Link to="/recipes/search/">{t("layout.nav.search")}</Link>


                    {/* Dynamic Login/Logout */}
                    {user ? (
                        <div className="user-menu">
                            <span>{t("layout.nav.welcome")}, {user.username}!</span>
                            <button onClick={handleLogoutClick} className="logout-button">
                                {t("layout.nav.logout")}
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login/")} className="login-button">
                            {t("layout.nav.login")}
                        </button>
                    )}

                    {/*language switch*/}
                    <div className="language-switch">
                        <button onClick={() => changeLanguage('pl')}>🇵🇱 PL</button>
                        <button onClick={() => changeLanguage('sv')}>🇸🇪 SE</button>
                        <button onClick={() => changeLanguage('en')}>🇬🇧 EN</button>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <main className="content">{children}</main>


            {/* Bottom navigation bar */}
            <footer className="footer">
                <div className="footer-links">
                    <Link to="/about">{t("layout.footer.about")}</Link>
                    <Link to="/contact">{t("layout.footer.contact")}</Link>
                    <Link to="/privacy">{t("layout.footer.privacy")}</Link>
                </div>
                <p>© 2024 {t("layout.footer.copyright")}</p>
            </footer>
        </div>
    );
};

export default Layout;