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

const TVShowPage = () => {
  const { id } = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const POSTER_URLS = {
    movie: {},
    series: {
      136315: 'https://image.tmdb.org/t/p/original/e75gHEv4115AURmW16jpU6ZtMuD.jpg',
      1399: 'https://image.tmdb.org/t/p/original/eDn8XWA0a4U3zOhd1gh7HExdt4Y.jpg',
      100088: 'https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    }
  };

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const tvShowResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=5b5a87f250e0180bbc1c49b6d5fdf5db&language=pt-BR`
        );
        setTVShow(tvShowResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=5b5a87f250e0180bbc1c49b6d5fdf5db&language=pt-BR`
        );
        setCast(castResponse.data.cast);
      } catch (error) {
        console.error("Erro ao buscar detalhes da série:", error);
      }
    };

    fetchTVShowDetails();
  }, [id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  if (!tvShow) return <div></div>;

  const posterUrl = POSTER_URLS.series[tvShow.id]
    ? POSTER_URLS.series[tvShow.id]
    : `https://image.tmdb.org/t/p/w400/${tvShow.poster_path}`;

  const { fullStars, halfStar, emptyStars } = getStars(tvShow.vote_average);

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

        <div className="banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${tvShow.backdrop_path})` }}></div>
        <div className="tv-show-details">
          <div className="tv-show-content">
            <div className="poster-and-rating">
              <img
                src={posterUrl}
                alt={tvShow.name}
                className="tv-show-poster"
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
            <div className="tv-show-description">
              <h1>
                {tvShow.name} <span className="release-year">({tvShow.first_air_date.split('-')[0]})</span>
              </h1>
              <p>{tvShow.overview}</p>
              <h4>
                Temporadas: {tvShow.number_of_seasons} | Episódios: {tvShow.number_of_episodes}
              </h4>
              <div className="barra">
                <hr />
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

export default TVShowPage;
