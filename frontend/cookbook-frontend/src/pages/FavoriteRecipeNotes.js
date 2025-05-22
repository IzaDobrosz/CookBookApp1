import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import axios from "axios";

const FavoriteRecipeNotes = ({ recipeId }) => {
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage(t("notes.loginToFetch"));
                return;
            }

            try {
                const response = await axios.get(`/api/favorites/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setNotes(response.data.notes || "");
            } catch (error) {
                console.error("Error fetching notes:", error.response?.data || error.message);
                setMessage(t("notes.fetchError"));
            }
        };

        fetchNotes();
    }, [recipeId]);

    const handleNotesSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage(t("notes.loginToSave"));
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
            setMessage(t("notes.saveSuccess"));
        } catch (error) {
            setMessage(t("notes.saveError", { error: error.response?.data?.message || error.message }));
        }
    };

    return (
        <div className="notes-section">
            <h2 className="section-title">{t("notes.title")}</h2>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notes.placeholder")}
                className="notes-textarea"
            />
            <button onClick={handleNotesSave} className="save-notes-btn">
                {t("notes.saveButton")}
            </button>
            {message && <p className="notes-message">{message}</p>}
        </div>
    );
};

export default FavoriteRecipeNotes;