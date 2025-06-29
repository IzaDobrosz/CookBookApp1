import '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './RecipeStep.css';
import thermometerIcon from '../assets/icons/thermometerIcon.svg';
import clockIcon from '../assets/icons/clockIcon.svg';

const RecipeStep = () => {
    const { recipeId, stepNumber } = useParams(); // Get recipe and step ID from URL
    const [recipeSteps, setRecipeSteps] = useState([]); // Store all steps
    const [currentStep, setCurrentStep] = useState(null); // Store the current step
    const [error, setError] = useState(null); // Error handling
    const [showEndPopup, setShowEndPopup] = useState(false);
    const [showTimerPopup, setShowTimerPopup] = useState(false); // Popup for timer
    const [remainingTime, setRemainingTime] = useState(0); // Time remaining for the timer
    const [timerActive, setTimerActive] = useState(false); // Timer state
    const [timerStatus, setTimerStatus] = useState("stopped"); // State for timer status
    const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed for display
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchRecipeSteps = async () => {
            try {
                // Fetch all steps for the recipe
                const response = await axios.get(`/api/recipe/${recipeId}/steps/`);
                const steps = response.data.results;
                setRecipeSteps(steps);

                // Find the current step based on stepNumber
                const step = steps.find(
                    (s) => s.step_number === parseInt(stepNumber, 10)
                );
                // Set the current step
                setCurrentStep(step);
            } catch (err) {
                setError(t("recipeStep.error"));
                console.error(err);
            }
        };

        fetchRecipeSteps();
    }, [recipeId, stepNumber, i18n.language]);

    // Initialize timer if step has time
    useEffect(() => {
        if (currentStep && typeof currentStep.time === 'number') {
            // If current step has time, initialize the timer
            setRemainingTime(currentStep.time * 60); // Convert into seconds
            setTimeElapsed(0);
            setTimerStatus("stopped");
        }
    }, [currentStep]);

    // Timer logic
    useEffect(() => {
        let timerInterval;

        if (timerStatus === "running" && remainingTime > 0) {
            timerInterval = setInterval(() => {
                setRemainingTime((prevTime) => Math.max(prevTime - 1), 0);
                setTimeElapsed((prevElapsed) => prevElapsed + 1);
            }, 1000);
        } else if (remainingTime === 0 && timerStatus === "running") {
            setShowTimerPopup(true);
            setTimerStatus("stopped");
            setTimeout(() => setShowTimerPopup(false), 5000);
        }

        return () => clearInterval(timerInterval);
    }, [remainingTime, timerStatus]);

//     useEffect(() => {
//     console.log("Current Step:", currentStep);
//     console.log("Remaining Time:", remainingTime);
//     console.log("Time Elapsed:", timeElapsed);
// }, [currentStep, remainingTime, timeElapsed]);

    const startPauseTimer = () => {
        if (timerStatus === "stopped" || timerStatus === "paused") {
            setTimerStatus("running"); // Start or resume the timer
        } else if (timerStatus === "running") {
            setTimerStatus("paused"); // Pause the timer
        }
    };

    const resetTimer = () => {
        setRemainingTime(currentStep.time * 60);
        setTimeElapsed(0);
        setTimerStatus("stopped");
    };

    // const startTimer = () => {
    //     setTimerActive(true);
    // };

    // Handle errors or loading
    if (error) {
        return <p>{error}</p>;
    }

    if (!currentStep) {
        return <p>{t("recipeStep.loading")}</p>;
    }

    // Calculate steps progress as %
    const stepProgress = (parseInt(stepNumber, 10) / recipeSteps.length) * 100;

    // Calculate timer progress
    const timerProgress = currentStep?.time
        ? Math.min((timeElapsed / (currentStep.time * 60)) * 100, 100)
        : 0;

    // Navigation functions
    const handleNextStep = () => {
        const nextStep = parseInt(stepNumber, 10) + 1;
        if (nextStep <= recipeSteps.length) {
            navigate(`/recipe/${recipeId}/steps/${nextStep}/`);
        } else {
            setShowEndPopup(true); // Show popup on last step
            setTimeout(() => setShowEndPopup(false), 5000); // Hide popup
        }
    };

    const handlePreviousStep = () => {
        const previousStep = parseInt(stepNumber, 10) - 1;
        if (previousStep > 0) {
            navigate(`/recipe/${recipeId}/steps/${previousStep}/`);
        }
    };

    return (
        <div className="recipe-step-container">
            <div className="step-tracker">
                {/*<h2>Step {currentStep.step_number} out of {recipeSteps.length}</h2>*/}
                <h2>{t("recipeStep.step_header", { current: currentStep.step_number, total: recipeSteps.length })}</h2>

            </div>
            {/* Progress bar */}
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${stepProgress}%` }}></div>
            </div>

            <p>{currentStep.translations[i18n.language]?.instruction ||
                currentStep.translations.en?.instruction ||
                t("recipeStep.instruction_missing")}</p>
            <div className="temperature-time-container">
                {currentStep.temperature && (
                    <p className="temperature">
                        <img src={thermometerIcon} alt="Thermometer" />
                        {t("recipeStep.temperature", { temp: currentStep.temperature })}
                    </p>
                )}
                {currentStep.time && (
                    <div>
                        <p className="time">
                            <img src={clockIcon} alt="Clock" />
                            {t("recipeStep.time", { time: currentStep.time })}
                        </p>
                        <button
                            className="start-timer-button"
                            onClick={startPauseTimer}
                            >
                        {timerStatus === "running"
                            ? t("recipeStep.pause_timer")
                            : timerStatus === "paused"
                            ? t("recipeStep.resume_timer")
                            : t("recipeStep.start_timer")}
                        </button>
                        {timerStatus !== "stopped" && (
                            <button
                                className="reset-timer-button"
                                onClick={resetTimer}
                                >
                                {t("recipeStep.reset_timer")}
                            </button>
                        )}
                    </div>
                )}
            </div>


            {/*Timer progess bar*/}
            {currentStep.time && (
                <div className="timer-progress-container">
                    <div className="timer-progress-bar">
                        <div className="timer-progress"
                        style={{ width: `${timerProgress}%` }}></div>
                    </div>
                    <p>
                        {isNaN(remainingTime) ? '0:00' :
                        `${Math.floor(remainingTime / 60)}:${("0" + (remainingTime % 60)).slice(-2)}`}
                    </p>
                </div>
            )}

            <div className="navigation-buttons">
                <button onClick={handlePreviousStep} disabled={parseInt(stepNumber, 10) === 1}>
                    {t("recipeStep.previous")}
                </button>
                <button onClick={handleNextStep}>
                    {parseInt(stepNumber, 10) === recipeSteps.length ? t("recipeStep.finish") : t("recipeStep.next")}
                </button>
            </div>

            {/* Popup */}
            {showEndPopup && (
                <div className="po pup">
                    <div className="popup-content">
                        <h2>{t("recipeStep.end_popup_title")}</h2>
                        <p>{t("recipeStep.end_popup_message")}</p>
                    </div>
                </div>
            )}

            {showTimerPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{t("recipeStep.timer_popup_title")}</h2>
                        <p>{t("recipeStep.timer_popup_message")}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeStep;