import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_KEY = '5b5a87f250e0180bbc1c49b6d5fdf5db';
const SEARCH_API_URL = 'https://api.themoviedb.org/3/search/multi';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

      // Filtrar resultados para exibir apenas itens com mais de 500 votos (ou atores)
      const filteredResults = response.data.results
        .filter(result => 
          (result.vote_count > 50 || result.media_type === 'person') // Verifica contagem de votos ou se é um ator
        )
        .slice(0, 18); // Limita aos 16 primeiros resultados

      setSearchResults(filteredResults);
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
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Atualizar a URL
  };

  return (
    <body className='resultados'>
      <div>
      <header className="header">
          <Link to="/" className="home-button">
            <i className="fa fa-home"></i> HOME
          </Link>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Buscar filmes, séries, atores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
        </header>

        <h1 className="tituloh1">Resultados da sua busca: {query}</h1>

        {loading ? (
          <div></div>
        ) : (
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="result-item">
                {result.media_type === 'movie' || result.media_type === 'tv' ? (
                  <Link to={result.media_type === "movie" ? `/movie/${result.id}` : `/tv/${result.id}`}>
                    <img
                      src={result.poster_path ? `https://image.tmdb.org/t/p/w200/${result.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={result.title || result.name}
                    />
                    <div className="overlay">
                      <h3>{result.title || result.name}</h3>
                    </div>
                  </Link>
                ) : (
                  <Link to={`/actor/${result.id}`}>
                    <img
                      src={result.profile_path ? `https://image.tmdb.org/t/p/w200/${result.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={result.name}
                    />
                    <div className="overlay">
                      <h3>{result.name}</h3>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </body>
  );
};

export default SearchResultsPage;
