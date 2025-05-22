import axios from 'axios';
// This file sets the default Accept-Language HTTP header for all outgoing Axios requests.
//     It also stores the selected language in localStorage, so it persists across reloads.

// // Get language from localStorage or set up default
// const lang = localStorage.getItem("lang") || "en";
//
// // Set up global header
//
// axios.defaults.headers.common["Accept-Language"] = lang;

export const updateLanguageHeader = (lang) => {
    localStorage.setItem("lang", lang);
    axios.defaults.headers.common["Accept-Language"] = lang;
};

