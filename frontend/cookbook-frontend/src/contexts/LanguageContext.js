import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n/i18n";
import { updateLanguageHeader} from "../components/axiosConfig";

// This file creates a React Context to manage the user's selected language across the app. '
// 'It synchronizes:
// i18next language changes (i18n.changeLanguage)
// Axios headers (Accept-Language)
// LocalStorage

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const storedLang= localStorage.getItem("lang") || "en";
    const [language, setLanguage] = useState(storedLang);

    useEffect(() => {
        i18n.changeLanguage(language);
        updateLanguageHeader(language);
        localStorage.setItem("lang", language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage: setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};