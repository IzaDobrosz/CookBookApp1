import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const RecipeStepList = () => {
    const { recipeId } = useParams();    // Recipe ID from the URL
    const [recipeSteps, setRecipeSteps] = useState([]);   // Store steps
    const [error, setError] = useState(null);  // Error handling

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipeId}/steps/`);
                console.log(response.data.results);
                setRecipeSteps(response.data.results); // Store the steps in state
            } catch (error) {
                setError('Error loading steps');
                console.error(error);
            }
        };

        fetchSteps();
    }, [recipeId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!recipeSteps.length) {
        return <p>Loading steps...</p>;
    }

    return (
        <div>
            <h1>Recipe steps</h1>
            <ul>
                {recipeSteps.map((step) => (
                    <li key={step.step_number}>
                        <Link to={`/recipe/${recipeId}/steps/${step.step_number}`}>
                            Step {step.step_number}: {step.instruction}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeStepList;