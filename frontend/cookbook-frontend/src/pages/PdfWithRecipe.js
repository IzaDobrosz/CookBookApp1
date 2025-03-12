// RecipePDFButton.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Component to get single recipe PDF (named export)
export const RecipePDFButton = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    // const handleRecipePDFAction = (download = false) => {
    //     if (id) {
    //         const action = download ? `?download=true` : "";
    //         window.open(`/recipe/${id}/pdf/${action}`, '_blank');
    //     } else {
    //         console.error("Recipe ID is undefined");
    //     }
    // };

    const handleRecipePDFAction = async (download = false) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You need to login to generate PDF.");
            return;
        }
        if (id) {
            const action = download ? `?download=true` : "";
            const pdfUrl = `/api/recipe/${id}/pdf/${action}`;
            console.log("Generated PDF URL:", pdfUrl);  // Log the URL

            try {
                const response = await axios.get(pdfUrl, {
                    headers: { Authorization: `Token ${token}` },
                    responseType: "blob", // Ensure the response is treated as binary data (for files)
                });

                // Create a Blob object from the response data
                const file = new Blob([response.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);

                // Open the PDF in a new tab or download it
                if (download) {
                    const link = document.createElement("a");
                    link.href = fileURL;
                    link.download = `recipe_${id}.pdf`;
                    link.click();
                } else {
                    window.open(fileURL, "_blank");
                }

                // Clean up the object URL
                URL.revokeObjectURL(fileURL);
            } catch (error) {
                console.error("Failed to fetch the PDF:", error);
                setError("Failed to fetch the PDF. Please try again.");
            }
        } else {
            console.error("Recipe ID is undefined");
            setError("Recipe ID is undefined.");
        }
    };

    return (
        <div>
            <button onClick={() => handleRecipePDFAction(false)}>View Recipe PDF</button>
            <button onClick={() => handleRecipePDFAction(true)}>Download Recipe PDF</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

// // Component to download PDF for all recipes (named export)
// export const FavoritesPDFButton = () => {
//     const downloadFavoritesPDF = () => {
//         window.open(`/favorites/pdf/`);
//     };
//
//     return <button onClick={downloadFavoritesPDF}>Download All Favorites PDF</button>;
// };