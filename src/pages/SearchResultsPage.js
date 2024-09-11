import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_KEY = '5b5a87f250e0180bbc1c49b6d5fdf5db';
const SEARCH_API_URL = 'https://api.themoviedb.org/3/search/multi';

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: { api_key: API_KEY, query, language: 'pt-BR' },
      });
      setSearchResults(response.data.results.slice(0, 16));
    } catch (err) {
      console.error("Erro ao buscar resultados:", err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  return (
    <body>
    <div>
      {}
      <header className="header">
          <Link to="/" className="home-button">
            <i className="fa fa-home"></i> HOME
          </Link>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Buscar filmes e séries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}/>
          </form>
          <div className="search-icon">
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
        </header>

      <h1 class="tituloh1">Resultados da sua busca</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="search-results">
          {searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <Link to={result.media_type === "movie" ? `/movie/${result.id}` : `/tv/${result.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
                  alt={result.title || result.name}
                />
                <div className="overlay">
                  <h3>{result.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </body>
  );
};

export default SearchResultsPage;
