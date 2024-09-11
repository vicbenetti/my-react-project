import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_KEY = '5b5a87f250e0180bbc1c49b6d5fdf5db';
const MOVIES_API_URL = 'https://api.themoviedb.org/3/movie/top_rated';
const SERIES_IDS = [95396, 1399, 136315, 76331, 1920, 100088];
const ITEMS_PER_PAGE = 16;

const POSTER_URLS = {
  movie: {},
  series: {
    136315: 'https://image.tmdb.org/t/p/original/e75gHEv4115AURmW16jpU6ZtMuD.jpg',
    1399: 'https://image.tmdb.org/t/p/original/eDn8XWA0a4U3zOhd1gh7HExdt4Y.jpg',
    100088: 'https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
  }
};

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(MOVIES_API_URL, {
          params: { api_key: API_KEY, page: 1, language: 'pt-BR' },
        });
        setMovies(response.data.results);
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
        setError('Erro ao buscar filmes');
      }
      setLoadingMovies(false);
    };

    const fetchSeries = async () => {
      try {
        const requests = SERIES_IDS.map(id =>
          axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
            params: { api_key: API_KEY, language: 'pt-BR' },
          })
        );
        const responses = await Promise.all(requests);
        setSeries(responses.map(response => response.data));
      } catch (err) {
        console.error("Erro ao buscar séries:", err);
        setError('Erro ao buscar séries');
      }
      setLoadingSeries(false);
    };

    fetchMovies();
    fetchSeries();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  if (loadingMovies || loadingSeries) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <body>
      <div>
      <section class="recomendations">
        {/* Header com barra de pesquisa e botão de página inicial */}
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

          {/* Carrossel de recomendações */}
          <div className="carrossel">
            <h1 className='tituloh1'>Recomendações de nossos editores</h1>
            <div className="iframe-container" id="iframe-container">
              <iframe
                src="/seriesslider.html"
                className="iframezao"
                id="iframe1"
                title="Slider de Séries"
              ></iframe>
            </div>
          </div>
        </section>
        <section className='seriesfavoritas'>
        {/* Lista de séries */}
          <hr />
          <h1 className='tituloh1'>Séries para maratonar e não parar mais</h1>
          <div className="movie-list">
            {series.slice(0, ITEMS_PER_PAGE).map(tvShow => (
              <div key={tvShow.id} className="movie-item">
                <Link to={`/tv/${tvShow.id}`}>
                  <img
                    src={POSTER_URLS.series[tvShow.id] || `https://image.tmdb.org/t/p/w200/${tvShow.poster_path}`}
                    alt={tvShow.name}
                  />
                  <div className="overlay">
                    <h3>{tvShow.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Lista de filmes */}
        <hr />
        <h1 className='tituloh1'>Filmes mais bem avaliados pelos usuários</h1>
        <div className="movie-list">
          {movies.slice(0, ITEMS_PER_PAGE).map(movie => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={POSTER_URLS.movie[movie.id] || `https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="overlay">
                  <h3>{movie.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </body>
  );
};

export default HomePage;