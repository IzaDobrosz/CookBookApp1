// // import React, { useState } from "react";
// // import axios from "axios";
// // import "./SearchRecipes.css";
// //
// // const SearchRecipes = () => {
// //   const [recipes, setRecipes] = useState([]);
// //   const [filters, setFilters] = useState({
// //     name: "",
// //     type_of_dish: "",
// //     preparation_method: "",
// //     difficulty_level: "",
// //     ingredient_type: "",
// //   });
// //
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters({ ...filters, [name]: value });
// //   };
// //
// //   const handleSearch = async () => {
// //     try {
// //       const response = await axios.get("http://127.0.0.1:8000/api/recipes/search/", {
// //         params: filters,
// //       });
// //       setRecipes(response.data);
// //     } catch (error) {
// //       console.error("Error fetching recipes:", error);
// //     }
// //   };
// //
// //   return (
// //     <div className="search-container">
// //       <h2>Search Recipes</h2>
// //       <div className="filters">
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Recipe Name"
// //           value={filters.name}
// //           onChange={handleChange}
// //         />
// //         <select name="type_of_dish" onChange={handleChange}>
// //           <option value="">Select Type of Dish</option>
// //           <option value="APPETIZERS">Appetizers</option>
// //           <option value="SOUPS">Soups</option>
// //           <option value="SALADS">Salads</option>
// //           {/* Dodaj pozostałe opcje */}
// //         </select>
// //         <select name="preparation_method" onChange={handleChange}>
// //           <option value="">Preparation Method</option>
// //           <option value="FRYING">Frying</option>
// //           <option value="BOILING">Boiling</option>
// //           {/* Dodaj pozostałe opcje */}
// //         </select>
// //         <select name="difficulty_level" onChange={handleChange}>
// //           <option value="">Difficulty Level</option>
// //           <option value="EASY">Easy</option>
// //           <option value="INTERMEDIATE">Intermediate</option>
// //           <option value="DIFFICULT">Difficult</option>
// //         </select>
// //         <button onClick={handleSearch}>Search</button>
// //       </div>
// //       <div className="results">
// //         {recipes.length > 0 ? (
// //           recipes.map((recipe) => (
// //             <div key={recipe.id} className="recipe-card">
// //               <h3>{recipe.name}</h3>
// //               <p>{recipe.description}</p>
// //               <p><strong>Type:</strong> {recipe.type_of_dish}</p>
// //               <p><strong>Difficulty:</strong> {recipe.difficulty_level}</p>
// //             </div>
// //           ))
// //         ) : (
// //           <p>No recipes found.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };
// //
// // export default SearchRecipes;
//

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./SearchRecipes.css";

const SearchRecipes = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    type_of_dish: searchParams.get("type_of_dish") || "",
    preparation_method: searchParams.get("preparation_method") || "",
    difficulty_level: searchParams.get("difficulty_level") || "",
    ingredient_type: searchParams.get("ingredient_type") || "",
    preparation_time: searchParams.get("preparation_time") || "",
    tags: searchParams.get("tags") || "",
    favorites: searchParams.get("favorites") === "true" ? "true" : "",
  });
  const [tags, setTags] = useState(filters.tags || "");

  // Obsługa zmiany filtrów
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? (checked ? "true" : "") : value, // To handle checkbox too
    }));

    if (name === 'tags') {
      setTags(value);
    }
  };

  // Przekierowanie z parametrami po kliknięciu "Search"
  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add to UrL only filters which has values
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
            params.append(key, value);
        }
    });

    navigate(`/recipes/search?${params.toString()}`);
  };

    // Clear filters function
    const handleClearFilters = () => {
        setFilters({
        name: "",
        type_of_dish: "",
        preparation_method: "",
        difficulty_level: "",
        ingredient_type: "",
        preparation_time: "",
        tags: "",
        favorites: false, // Reset checkbox
    });

    navigate("/recipes/search/"); // Remove parameters from URL
    setRecipes([]); //Remove results
    };


  // Pobieranie wyników na podstawie URL (po załadowaniu strony i zmianie filtrów)
  useEffect(() => {
  // Check if any filter is set
    const hasFilters = Object.entries(filters).some(
    ([key, value]) => key !== "favorites" && value !== ""
    );

    if (!hasFilters) {
        setRecipes([]); // If no filters => show no results
        return;
    }

    const fetchRecipes = async () => {
      try {
        const queryParams = { ...filters };
        if (filters.favorites !== "true") {
            delete queryParams.favorites;
        }

        const response = await axios.get("/api/recipes/search/", {
          params: queryParams,
        });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [searchParams, filters ]); // Refresh after change of parameters in URL TU ZMIANA: filters

  return (
    <div className="search-container">
      <h2>Search Recipes</h2>

      {/* 🔍 Panel filtrów */}
      <div className="filters">
        <input
            type="text"
            name="name"
            placeholder="Recipe Name"
            value={filters.name}
            onChange={handleChange}
        />
        <select name="type_of_dish" value={filters.type_of_dish} onChange={handleChange}>
          <option value="">Select Type of Dish</option>
          <option value="APPETIZERS">Appetizers</option>
          <option value="SOUPS">Soups</option>
          <option value="SALADS">Salads</option>
          <option value="MAIN_DISHES">Main Dishes</option>
          <option value="DESSERTS">Desserts</option>
          <option value="SNACKS">Snacks</option>
          <option value="DRINKS">Drinks</option>
          <option value="BREAD">Bread</option>
        </select>
        <select name="preparation_method" value={filters.preparation_method} onChange={handleChange}>
          <option value="">Preparation Method</option>
          <option value="FRYING">Frying</option>
          <option value="BOILING">Boiling</option>
          <option value="GRILLING">Grilling</option>
          <option value="BAKING">Baking</option>
          <option value="STEAMING">Steaming</option>
          <option value="SOUS-VIDE">Sous-vide</option>
          <option value="RAW">Raw</option>
        </select>
        <select name="difficulty_level" value={filters.difficulty_level} onChange={handleChange}>
          <option value="">Difficulty Level</option>
          <option value="EASY">Easy</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="DIFFICULT">Difficult</option>
        </select>

        <select name="ingredient_type" value={filters.ingredient_type} onChange={handleChange}>
          <option value="">Ingredient Type</option>
          <option value="VEGETABLE_BASED">Vegetable-Based</option>
          <option value="MEAT_BASED">Meat-Based</option>
          <option value="FISH_BASED">Fish-Based</option>
          <option value="FRUIT_BASED">Fruit-Based</option>
          <option value="SEAFOOD">Seafood</option>
          <option value="DAIRY_BASED">Dairy-Based</option>
          <option value="PASTA_RICE_BASED">Pasta/Rice-Based</option>
        </select>

        <select name="preparation_time" value={filters.preparation_time} onChange={handleChange}>
          <option value="">Preparation Time</option>
          <option value="QUICK">Quick</option>
          <option value="MEDIUM">Medium</option>
          <option value="TIME_CONSUMING">Time-Consuming</option>
        </select>

        <label>
          <input
              type="checkbox"
              name="favorites"
              checked={filters.favorites}
              onChange={handleChange}
          />
          Show only favorites
        </label>

        <label>
          Tags (comma-separated):
          <input
              type="text"
              name="tags"
              placeholder=""
              value={tags}
              onChange={(e) => setTags(e.target.value)}
          />
        </label>

        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClearFilters} className="clear-btn">Clear Filters</button>
        {/* Clear filters btn */}
      </div>

      {/* 📜 Lista wyników */}
      <div className="results">
        {recipes.length > 0 ? (
            recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <h3>{recipe.name}</h3>
                  <p>{recipe.description}</p>
                  <p><strong>Type:</strong> {recipe.type_of_dish}</p>
                  <p><strong>Difficulty:</strong> {recipe.difficulty_level}</p>
                </div>
            ))
        ) : (
            <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchRecipes;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import "./SearchRecipes.css";
//
// const SearchRecipes = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [recipes, setRecipes] = useState([]);
//   const [filters, setFilters] = useState({
//     q: searchParams.get("q") || "", // 🔍 Pełnotekstowe wyszukiwanie
//     name: searchParams.get("name") || "",
//     type_of_dish: searchParams.get("type_of_dish") || "",
//     preparation_method: searchParams.get("preparation_method") || "",
//     difficulty_level: searchParams.get("difficulty_level") || "",
//     ingredient_type: searchParams.get("ingredient_type") || "",
//     favorites: searchParams.get("favorites") === "true" || false, // 🌟 Ulubione
//   });
//
//   const [filterOptions, setFilterOptions] = useState({
//     type_of_dish: [],
//     preparation_method: [],
//     difficulty_level: [],
//     ingredient_type: [],
//   });
//
//   useEffect(() => {
//     // Pobieranie dostępnych opcji filtrów z backendu
//     const fetchFilterOptions = async () => {
//       try {
//         const response = await axios.get("/api/recipes/filter-options/");
//         setFilterOptions(response.data);
//       } catch (error) {
//         console.error("Error fetching filter options:", error);
//       }
//     };
//
//     fetchFilterOptions();
//   }, []);
//
//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get("/api/recipes/search/", {
//           params: filters,
//         });
//         setRecipes(response.data);
//       } catch (error) {
//         console.error("Error fetching recipes:", error);
//       }
//     };
//
//     fetchRecipes();
//   }, [searchParams]);
//
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };
//
//   const handleSearch = () => {
//     const params = new URLSearchParams(filters);
//     navigate(`/recipes/search?${params.toString()}`);
//   };
//
//   return (
//     <div className="search-container">
//       <h2>Search Recipes</h2>
//
//       <div className="filters">
//         <input
//           type="text"
//           name="q"
//           placeholder="Search by name, ingredients..."
//           value={filters.q}
//           onChange={handleChange}
//         />
//         <select name="type_of_dish" value={filters.type_of_dish} onChange={handleChange}>
//           <option value="">Select Type of Dish</option>
//           {filterOptions.type_of_dish.map((option) => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//         <select name="preparation_method" value={filters.preparation_method} onChange={handleChange}>
//           <option value="">Select Preparation Method</option>
//           {filterOptions.preparation_method.map((option) => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//         <select name="difficulty_level" value={filters.difficulty_level} onChange={handleChange}>
//           <option value="">Select Difficulty Level</option>
//           {filterOptions.difficulty_level.map((option) => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//         <select name="ingredient_type" value={filters.ingredient_type} onChange={handleChange}>
//           <option value="">Select Ingredient Type</option>
//           {filterOptions.ingredient_type.map((option) => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//         <label>
//           <input
//             type="checkbox"
//             name="favorites"
//             checked={filters.favorites}
//             onChange={handleChange}
//           />
//           Show only favorites
//         </label>
//         <button onClick={handleSearch}>Search</button>
//       </div>
//
//       <div className="results">
//         {recipes.length > 0 ? (
//           recipes.map((recipe) => (
//             <div key={recipe.id} className="recipe-card">
//               <h3>{recipe.name}</h3>
//               <p>{recipe.description}</p>
//               <p><strong>Type:</strong> {recipe.type_of_dish}</p>
//               <p><strong>Difficulty:</strong> {recipe.difficulty_level}</p>
//             </div>
//           ))
//         ) : (
//           <p>No recipes found.</p>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default SearchRecipes;