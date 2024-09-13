import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const getStars = (rating) => {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return {
    fullStars,
    halfStar,
    emptyStars,
  };
};

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=5b5a87f250e0180bbc1c49b6d5fdf5db&language=pt-BR`
        );
        setMovie(movieResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=5b5a87f250e0180bbc1c49b6d5fdf5db&language=pt-BR`
        );
        setCast(castResponse.data.cast);

        const directorData = castResponse.data.crew.find(member => member.job === 'Director');
        setDirector(directorData ? directorData.name : 'Desconhecido');
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <div></div>;

  const { fullStars, halfStar, emptyStars } = getStars(movie.vote_average);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <>
      <body>
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
            />
          </form>
          <div className="search-icon">
            <i className="fa fa-search" aria-hidden="true"></i>
          </div>
        </header>

        {/* Banner */}
        <div
          className="banner"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          }}
        ></div>

        {/* Conteúdo do filme */}
        <div className="movie-details">
          <div className="movie-content">
            <div className="poster-and-rating">
              <img
                src={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="rating-stars below-poster">
                {[...Array(fullStars)].map((_, index) => (
                  <span key={index} className="star full-star">★</span>
                ))}
                {halfStar && <span className="star half-star">★</span>}
                {[...Array(emptyStars)].map((_, index) => (
                  <span key={index} className="star empty-star">☆</span>
                ))}
              </div>
            </div>
            <div className="movie-description">
              <h1>
                {movie.title} <span className="release-year">({movie.release_date.split('-')[0]})</span>
              </h1>
              <p>{movie.overview}</p>
              <h4>Duração: {movie.runtime} minutos | Dirigido por: {director}</h4>
              <div className="barra">
                <hr/>
              </div>
              <h3>Elenco:</h3>
              <div className="cast-list">
                {cast.slice(0, 5).map(actor => (
                  <Link to={`/actor/${actor.id}`} key={actor.cast_id} className="cast-member">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={actor.name}
                      className="cast-photo"
                    />
                    <p>{actor.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default MoviePage;
