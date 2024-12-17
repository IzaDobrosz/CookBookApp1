import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            {/* Upper navigation bar */}
            <header className="header">
                <div className="logo">
                    <Link to="/landing-page/">CookBook</Link>
                </div>
                <nav className="nav">
                    <Link to="/landing-page/">Home</Link>
                    <Link to="/recipes/">Recipes</Link>
                    <Link to="/login/">Login</Link>
                    <Link to="/logout/">Logout</Link>
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