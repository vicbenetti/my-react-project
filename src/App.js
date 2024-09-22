// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import SeriesPage from './pages/SeriesPage';
import './App.css'; // Certifique-se de que o caminho para o CSS está correto
import SearchResultsPage from "./pages/SearchResultsPage";
import ActorPage from "./pages/ActorPage"; // Importar o novo componente
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/tv/:id" element={<SeriesPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/actor/:id" element={<ActorPage />} />
      </Routes>
    </Router>
  );
};

export default App;