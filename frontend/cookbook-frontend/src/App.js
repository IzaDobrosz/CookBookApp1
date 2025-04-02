import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider} from "./pages/AuthContext";
import './App.css';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeStep from "./pages/RecipeStep";
import RecipeStepList from './pages/RecipeStepList';
import Comments from './pages/Comments';
import LandingPage from "./pages/LandingPage";
import Layout from './components/Layout';
import {RecipePDFButton} from "./pages/PdfWithRecipe";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import FavoriteRecipes from "./pages/ListOfFavorites";
import RecipeSearchModal from "./pages/SearchBar";
import SearchRecipes from "./pages/SearchRecipes";
// import AdminStats from "./pages/AdminStats";
import Dashboard from "./pages/Dashboard";

const App = () => {
    return (
         <AuthProvider>
            <Router>
                <Layout>
                    <div className="App">
                        <header className="App-header">
                            {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                            {/*<p>*/}
                            {/*    Edit <code>src/App.js</code> and save to reload.*/}
                            {/*</p>*/}
                            <a
                                // className="App-link"
                                // href="https://reactjs.org"
                                // target="_blank"
                                // rel="noopener noreferrer"
                            >
                                CookBook
                            </a>
                        </header>

                        <Routes>
                            {/* Route for the landing page */}
                            <Route path="/landing_page/" element={<LandingPage />} />
                            {/* Route for the list of recipes */}
                            <Route path="/recipes/" element={<RecipeList />} />
                            {/* Route for individual recipe details */}
                            <Route path="/recipe/:id/" element={<RecipeDetail />} />
                            {/* Route for list of all steps */}
                            {/*<Route path="/recipe/:recipeId/steps" element={<RecipeStepList />} />*/}
                             Route for  recipe single step
                            <Route path="/recipe/:recipeId/steps/:stepNumber/" element={<RecipeStep />} />
                            Route for  recipe comments
                            <Route path="/recipe/:recipeId/comments/" element={<Comments />} />
                            Route for  recipe single comment
                            <Route path="/recipe/:recipeId/comments/:commentId/" element={<Comments />} />
                            Route for Favorites
                            <Route path="/favorites/" element={<FavoriteRecipes />} />
                            Route for Search results
                            <Route path="/recipes/search/" element={<SearchRecipes />} />
                            Route for  single recipe PDF - path go to backend
                            <Route path="/recipe/:id/pdf/*" element={null} />
                            Route for  login
                            <Route path="/login/" element={<Login />} />
                            Route for  single recipe PDF
                            <Route path="/logout/" element={<Logout />} />
                            Route for fallback
                            <Route path="*" element={<div>Page not found</div>} />
                            Route for statistics
                            <Route path="/statistics/" element={<Dashboard />} />
                        </Routes>
                    </div>
                </Layout>
            </Router>
         </AuthProvider>
    );
};

export default App;
