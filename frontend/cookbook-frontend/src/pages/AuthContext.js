import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Take user from localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const user_id = localStorage.getItem("user_id");

        if (token && username && user_id) {
            setUser({ username, user_id });
        }
    }, []);

    // After user login save data in localStorage
    const login = async (credentials) => {
        try {
            const response = await axios.post("/api/login/", credentials);
            const { token, username, user_id } = response.data;

            // Save data in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("user_id", user_id);

            // Set state in context
            setUser({ username, user_id });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };


    // Logout
    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/logout/", {}, {
                headers: { Authorization: `Token ${token}` }
            });

            // Remove user data from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("user_id");

            // Reset user state
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};