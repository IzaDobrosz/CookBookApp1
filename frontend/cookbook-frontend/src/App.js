import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeStep from "./pages/RecipeStep";


const App = () => {
    return (
        <Router>
            <div className="App">
                {/*<RecipeList/>*/}
                {/*<RecipeDetail/>*/}
                <header className="App-header">
                    {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                    {/*<p>*/}
                    {/*    Edit <code>src/App.js</code> and save to reload.*/}
                    {/*</p>*/}
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CookBook
                    </a>
                </header>

                <Routes>
                    {/* Route for the list of recipes */}
                    <Route path="/recipes/" element={<RecipeList />} />

                    {/* Route for individual recipe details */}
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    {/* Route for individual recipe steps */}
                    <Route path="/recipe/:id/cook/:step" element={<RecipeStep />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
