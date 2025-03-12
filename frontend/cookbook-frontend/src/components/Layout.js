import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext"; // Import AuthContext
import "./Layout.css";

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogoutClick = async () => {
        try {
            await logout();
            navigate("/login/");
        } catch {
            alert("Logout failed. Please try again later.");
        }
    };

    return (
        <div className="layout">
            {/* Upper navigation bar */}
            <header className="header">
                <div className="logo">
                    {/*<Link to="/landing-page/">CookBook</Link>*/}
                </div>
                <nav className="nav">
                    <Link to="/landing_page/">Home</Link>
                    <Link to="/recipes/">Recipes</Link>
                    <Link to="/favorites/">Favorites</Link>
                    {/*<Link to="/login/">Login</Link>*/}
                    {/*<Link to="/logout/">Logout</Link>*/}
                    <Link to="/recipes/search/">Search</Link>


                    {/* Dynamic Login/Logout */}
                    {user ? (
                        <div className="user-menu">
                            <span>Welcome, {user.username}!</span>
                            <button onClick={handleLogoutClick} className="logout-button">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login/")} className="login-button">
                            Login
                        </button>
                    )}
                </nav>
            </header>

            {/* Main content */}
            <main className="content">{children}</main>


            {/* Bottom navigation bar */}
            <footer className="footer">
                <div className="footer-links">
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
                <p>© 2024 CookBook. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;