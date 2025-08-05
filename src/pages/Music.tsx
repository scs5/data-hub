import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface ApiResponse {
  items: Artist[];
}

const Music: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const url = 'https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json';

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: ApiResponse) => {
        console.log('Fetched JSON data:', data);
        setArtists(data.items);
      })
      .catch((err) => {
        console.error('Failed to fetch JSON:', err);
      });
  }, []);

  return (
    <div className="music-container">
      <h1>Music</h1>
      {artists.length > 0 ? (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {artist.name}
              </a>{' '}
              - Popularity: {artist.popularity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading artists...</p>
      )}
      <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem', display: 'inline-block' }}>
        Back to Menu
      </Link>
    </div>
  );
};

export default Music;
