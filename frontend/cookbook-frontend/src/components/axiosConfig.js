import axios from 'axios';

// Get language from localStorage or set up default
const lang = localStorage.getItem("lang") || "en";

// Set up global header

axios.defaults.headers.common["Accept-Language"] = lang;

export const updateLanguageHeader = (lang) => {
    localStorage.setItem("lang", lang);
    axios.defaults.headers.common["Accept-Language"] = lang;
};

