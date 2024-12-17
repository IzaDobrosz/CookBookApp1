// RecipePDFButton.js
import React from "react";
import { useParams } from "react-router-dom";

// Component to get single recipe PDF (named export)
export const RecipePDFButton = () => {
    const { id } = useParams();

    // const handleRecipePDFAction = (download = false) => {
    //     if (id) {
    //         const action = download ? `?download=true` : "";
    //         window.open(`/recipe/${id}/pdf/${action}`, '_blank');
    //     } else {
    //         console.error("Recipe ID is undefined");
    //     }
    // };

    const handleRecipePDFAction = (download = false) => {
    if (id) {
        const action = download ? `?download=true` : "";
        const pdfUrl = `/recipe/${id}/pdf/${action}`;
        console.log("Generated PDF URL:", pdfUrl);  // Log the URL
        // window.open(pdfUrl, '_blank');
        window.location.href = pdfUrl;  //popup blocker ->navigate to the PDF URL in the same tab
    } else {
        console.error("Recipe ID is undefined");
    }
};

    return (
        <div>
            <button onClick={() => handleRecipePDFAction(false)}>View Recipe PDF</button>
            <button onClick={() => handleRecipePDFAction(true)}>Download Recipe PDF</button>
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