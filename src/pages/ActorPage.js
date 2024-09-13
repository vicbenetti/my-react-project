import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API_KEY = '5b5a87f250e0180bbc1c49b6d5fdf5db';

const ActorPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [knownFor, setKnownFor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    const fetchActorDetails = async () => {
      setLoading(true);
      try {
        // Requisição para buscar detalhes do ator em português
        const actorResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=pt-BR`
        );
        
        const actorData = actorResponse.data;
  
        // Se a biografia em português não estiver disponível, faz outra requisição em inglês
        if (!actorData.biography) {
          const actorResponseEnglish = await axios.get(
            `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`
          );
          actorData.biography = actorResponseEnglish.data.biography; // Atualiza com a biografia em inglês
        }
  
        setActor(actorData);
  
        // Requisição para buscar os créditos combinados (filmes e séries)
        const combinedCreditsResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=pt-BR`
        );
  
        // Filtrar e ordenar créditos
        const credits = combinedCreditsResponse.data.cast
          .filter(item => 
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.vote_count > 650
          )
          .sort((a, b) => b.popularity - a.popularity);
  
        // Remover itens duplicados baseados no ID
        const seen = new Set();
        const uniqueCredits = credits.filter(item => {
          const isDuplicate = seen.has(item.id);
          seen.add(item.id);
          return !isDuplicate;
        });
  
        // Selecionar os 6 mais populares
        setKnownFor(uniqueCredits.slice(0, 20));
      } catch (error) {
        setError('Erro ao buscar detalhes do ator');
      }
      setLoading(false);
    };
  
    fetchActorDetails();
  }, [id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  if (loading) return <div></div>;
  if (error) return <div>{error}</div>;
  if (!actor) return <div>Ator não encontrado.</div>;

  // Obtém a descrição em português, se disponível, ou usa a descrição em inglês como fallback
  const description = (actor.biography || 'Descrição não disponível.').slice(0, 500) + 
  (actor.biography && actor.biography.length > 600 ? '...' : '');

  return (
    <body className="bodyactor">
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
      <br></br>
      <br></br>
      <div className="actor-details">
        <div className="actor-content">
          <div className="poster-actor">
            <img
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w400/${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
              alt={actor.name}
            />
          </div>
          <div className="actor-description">
            <h1 className="h1actor">{actor.name}</h1>
            <br></br>
            <p>{description}</p>
            <div className="barra">
                <hr/>
              </div>
            <div className="know-for">
              <h3>Conhecido por:</h3>
            </div>
            <div className="movie-list">
              {knownFor.map(item => (
                <div key={item.id} className="movie-item">
                  <Link to={`/${item.media_type}/${item.id}`}>
                    <img
                    src={POSTER_URLS.series[item.id] || `https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                    alt={item.title || item.name}
                    />
                    <div className="overlay">
                      <h3>{item.character}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </body>
  );
};

export default ActorPage;
