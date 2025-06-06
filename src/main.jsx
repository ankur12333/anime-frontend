import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch('http://localhost:3001/api/anime');
        if (!res.ok) throw new Error('Failed to fetch anime list');
        const data = await res.json();
        setAnimeList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, []);

  // Group anime by genre
  const genreMap = {};
  animeList.forEach(anime => {
    if (anime.genres && anime.genres.length > 0) {
      anime.genres.forEach(genre => {
        if (!genreMap[genre]) genreMap[genre] = [];
        genreMap[genre].push(anime);
      });
    } else {
      if (!genreMap["Unknown"]) genreMap["Unknown"] = [];
      genreMap["Unknown"].push(anime);
    }
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
        ⏳ Loading your anime watchlist...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>📺Anime Watchlist</h1>

        {/* Total anime count */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>
          Total Anime: {animeList.length}
        </div>

        {Object.keys(genreMap).sort().map(genre => (
          <section key={genre} style={{ marginBottom: '3rem' }}>
            <h2 style={{ borderBottom: '2px solid #555', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
              {genre}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.2rem',
              }}
            >
              {genreMap[genre].map(anime => (
                <a
                  key={anime.mal_id}
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Go to MAL page for ${anime.title}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    backgroundColor: '#fff',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div
                    style={{
                      height: 260,
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={anime.image}
                      alt={anime.title}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                      onError={e => {
                        e.currentTarget.src = '/fallback.png'; // fallback image
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: '0.6rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      textAlign: 'center',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    {anime.title}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer
        style={{
          textAlign: 'center',
          padding: '1rem 0',
          borderTop: '1px solid #ddd',
          marginTop: '2rem',
          color: '#555',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          backgroundColor: '#fafafa',
        }}
      >
        Developed by Ankur P Barman
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
