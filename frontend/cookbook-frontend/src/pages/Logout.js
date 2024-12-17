import React from "react";
import axios from "axios";
import "./Logout.css";

const Logout = () => {
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "/logout/",
                {},
                { headers : { Authorization: `Token ${token}`}}
            );
            localStorage.removeItem("token");
            alert("Logged out successfully!");
        } catch (err) {
            alert("Something went wrong");
        }
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default Logout;