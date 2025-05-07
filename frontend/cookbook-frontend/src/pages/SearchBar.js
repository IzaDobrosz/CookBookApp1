// // import React, { useState } from "react";
// // import axios from "axios";
// // import "./SearchBar.css";
// //
// // const SearchBar = ({ onResults }) => {
// //     const [query, setQuery] = useState("");
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [tags, setTags] = useState("");
// //     const [favoritesOnly, setFavoritesOnly] = useState(false);
// //     const [typeOfDish, setTypeOfDish] = useState("");
// //
// //     const handleSearch = async () => {
// //         try {
// //             const response = await axios.get("/api/recipes/search/", {
// //                 params: {
// //                     q: query,
// //                     tags: tags.split(","),
// //                     favorites: favoritesOnly,
// //                     typeOfDish: typeOfDish,
// //                 },
// //             });
// //             onResults(response.data); // Send results to parent component}
// //         } catch (error) {
// //             console.error("Search failed:", error);
// //         }
// //     };
// //
// //     return (
// //         <div className="search-bar">
// //             <input
// //                 type="text"
// //                 placeholder="Search recipes..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //             />
// //             <button onClick={() => setIsModalOpen(true)}>Filter</button>
// //             <button onClick={handleSearch}>Search</button>
// //
// //             {isModalOpen && (
// //                 <div className="modal">
// //                     <div className="modal-content">
// //                         <h2>Filter Recipes</h2>
// //                         <label>
// //                             Tags (comma-separated):
// //                             <input
// //                                 type="text"
// //                                 value={tags}
// //                                 onChange={(e) => setTags(e.target.value)}
// //                             />
// //                         </label>
// //                         <label>
// //                             <input
// //                                 type="checkbox"
// //                                 checked={favoritesOnly}
// //                                 onChange={(e) => setFavoritesOnly(e.target.checked)}
// //                             />
// //                             Favorites Only
// //                         </label>
// //                         <label>
// //                             Type of Dish:
// //                             <select
// //                                 value={typeOfDish}
// //                                 onChange={(e) => setTypeOfDish(e.target.value)}
// //                             >
// //                                 <option value="">All Types</option>
// //                                 <option value="APPETIZERS">Appetizers</option>
// //                                 <option value="SOUPS">Soups</option>
// //                                 <option value="SALADS">Salads</option>
// //                                 <option value="MAIN_DISHES">Main Dishes</option>
// //                                 <option value="DESSERTS">Desserts</option>
// //                                 <option value="SNACKS">Snacks</option>
// //                                 <option value="DRINKS">Drinks</option>
// //                                 <option value="BREAD">Bread</option>
// //                             </select>
// //                         </label>
// //                         <button onClick={() => setIsModalOpen(false)}>Close</button>
// //                         <button
// //                             onClick={() => {
// //                                 handleSearch();
// //                                 setIsModalOpen(false);
// //                             }}
// //                         >
// //                             Apply Filters
// //                         </button>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };
// //
// // export default SearchBar;
//
// import React, { useState } from "react";
// import axios from "axios";
// import "./SearchBar.css";
//
// const RecipeSearchModal = ({ onClose, onResults, isOpen }) => {
//     const [typeOfDish, setTypeOfDish] = useState("");
//     const [preparationMethod, setPreparationMethod] = useState("");
//     const [ingredientType, setIngredientType] = useState("");
//     const [difficultyLevel, setDifficultyLevel] = useState("");
//     const [tags, setTags] = useState("");
//
//     const handleSearch = async () => {
//         try {
//             const response = await axios.get("/api/recipes/search/", {
//                 params: {
//                     type_of_dish: typeOfDish,
//                     preparation_method: preparationMethod,
//                     ingredient_type: ingredientType,
//                     difficulty_level: difficultyLevel,
//                     tags: tags.split(","),
//                 },
//             });
//             onResults(response.data); // Pass results to parent
//             onClose(); // Close modal after search
//         } catch (error) {
//             console.error("Error fetching recipes:", error);
//         }
//     };
//
//     return (
//         <div className="modal-overlay" style={{display: isOpen ? "" : "none"}}>
//             <div className="modal-content">
//                 <h2>Filter Recipes</h2>
//                 <label>
//                     Type of Dish:
//                     <select value={typeOfDish} onChange={(e) => setTypeOfDish(e.target.value)}>
//                         <option value="">All</option>
//                         <option value="APPETIZERS">Appetizers</option>
//                         <option value="SOUPS">Soups</option>
//                         <option value="SALADS">Salads</option>
//                         <option value="MAIN_DISHES">Main Dishes</option>
//                         <option value="DESSERTS">Desserts</option>
//                         <option value="SNACKS">Snacks</option>
//                         <option value="DRINKS">Drinks</option>
//                         <option value="BREAD">Bread</option>
//                     </select>
//                 </label>
//                 <label>
//                     Preparation Method:
//                     <select value={preparationMethod} onChange={(e) => setPreparationMethod(e.target.value)}>
//                         <option value="">All</option>
//                         <option value="FRYING">Frying</option>
//                         <option value="BOILING">Boiling</option>
//                         <option value="GRILLING">Grilling</option>
//                         <option value="BAKING">Baking</option>
//                         <option value="STEAMING">Steaming</option>
//                         <option value="SOUS-VIDE">Sous-vide</option>
//                         <option value="RAW">Raw</option>
//                     </select>
//                 </label>
//                 <label>
//                     Ingredient Type:
//                     <select value={ingredientType} onChange={(e) => setIngredientType(e.target.value)}>
//                         <option value="">All</option>
//                         <option value="VEGETABLE_BASED">Vegetable-Based</option>
//                         <option value="MEAT_BASED">Meat-Based</option>
//                         <option value="FISH_BASED">Fish-Based</option>
//                         <option value="FRUIT_BASED">Fruit-Based</option>
//                         <option value="SEAFOOD">Seafood</option>
//                         <option value="DAIRY_BASED">Dairy-Based</option>
//                         <option value="PASTA_RICE_BASED">Pasta/Rice-Based</option>
//                     </select>
//                 </label>
//                 <label>
//                     Difficulty Level:
//                     <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
//                         <option value="">All</option>
//                         <option value="EASY">Easy</option>
//                         <option value="INTERMEDIATE">Intermediate</option>
//                         <option value="DIFFICULT">Difficult</option>
//                     </select>
//                 </label>
//                 <label>
//                     Tags (comma-separated):
//                     <input
//                         type="text"
//                         placeholder="e.g., Vegan, Gluten-Free"
//                         value={tags}
//                         onChange={(e) => setTags(e.target.value)}
//                     />
//                 </label>
//                 <div className="modal-buttons">
//                     <button onClick={onClose}>Cancel</button>
//                     <button onClick={handleSearch}>Search</button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default RecipeSearchModal;