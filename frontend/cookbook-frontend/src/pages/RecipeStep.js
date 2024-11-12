import React, {useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import './RecipeStep.css';

const RecipeStep = () => {
    const {recipe_id, step} = useParams();    //Get recipe and step ID from URL
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipeSteps = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/recipe/${recipe_id}/steps/${step}/`);
                setRecipeSteps(response.data.steps);
                setCurrentStep(response.data.steps[step-1]);    //Setting current step
            } catch (error) {
                console.error('Error loading recipe steps:', error);
            }
        };
        fetchRecipeSteps();
    }, [recipe_id, step]);

    if (!currentStep) {
        return <p>Loading step ...</p>;
    }
    const handleNextStep = () => {
        if (parseInt(step) < recipeSteps.length) {
            navigate(`/recipe/${recipe_id}/cook/${parseInt(step) + 1}`);
        }
    };

    const handlePreviousStep = () => {
        if (parseInt(step) > 1) {
            navigate(`/recipe/${recipe_id}/cook/${parseInt(step) - 1}`);
        }
    };

    return (
        <div className="recipe-step-container">
            <h2>Step {currentStep.step_number}</h2>
            <p>{currentStep.instruction}</p>
            {currentStep.temperature && (
                <p>Temperature: {currentStep.temperature} °C</p>
            )}
            {currentStep.time && (
                <p>Time: {currentStep.time} min</p>
            )}

            <div className="navigation-buttons">
                <button onClick={handlePreviousStep} disabled={parseInt(step) === 1}>
                    Previous
                </button>
                <button onClick={handleNextStep} disabled={parseInt(step) === recipeSteps.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default RecipeStep;

