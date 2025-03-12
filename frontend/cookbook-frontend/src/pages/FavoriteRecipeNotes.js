import React, { useState, useEffect } from "react";
import axios from "axios";

const FavoriteRecipeNotes = ({ recipeId }) => {
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage("User not logged in, cannot fetch notes.");
                return;
            }

            try {
                const response = await axios.get(`/api/favorites/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setNotes(response.data.notes || "");
            } catch (error) {
                console.error("Error fetching notes:", error.response?.data || error.message);
                setMessage("Failed to load notes.");
            }
        };

        fetchNotes();
    }, [recipeId]);

    const handleNotesSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You need to login to save notes.");
            return;
        }

        try {
            await axios.patch(
                `/api/recipes/${recipeId}/`,
                { notes },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            setMessage("Notes updated successfully.");
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="notes-section">
            <h2 className="section-title">Your Notes</h2>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="notes-textarea"
            />
            <button onClick={handleNotesSave} className="save-notes-btn">
                Save Notes
            </button>
            {message && <p className="notes-message">{message}</p>}
        </div>
    );
};

export default FavoriteRecipeNotes;