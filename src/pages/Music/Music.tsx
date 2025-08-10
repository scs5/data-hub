import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Music.css';

interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface Track {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: { spotify: string };
  popularity: number;
}

interface ArtistsApiResponse {
  items: Artist[];
}

interface TracksApiResponse {
  items: Track[];
}

const Music: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsResponse, tracksResponse] = await Promise.all([
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json'),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_tracks.json')
        ]);

        if (!artistsResponse.ok) throw new Error(`Artists HTTP error! status: ${artistsResponse.status}`);
        if (!tracksResponse.ok) throw new Error(`Tracks HTTP error! status: ${tracksResponse.status}`);

        const artistsData: ArtistsApiResponse = await artistsResponse.json();
        const tracksData: TracksApiResponse = await tracksResponse.json();

        setArtists(artistsData.items);
        setTracks(tracksData.items);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="music-dashboard">
        <div className="loading">Loading music data...</div>
      </div>
    );
  }

  return (
    <div className="music-dashboard">
      {/* Row 1: Spotify Profile + Period Selector */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Spotify Profile</h2>
          </div>
          <div className="card-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎵</div>
              <p>Profile information will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Period Selector</h2>
          </div>
          <div className="card-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">📅</div>
              <p>Time period selection will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Tracks + Top Artists */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Top Tracks ({tracks.length})</h2>
          </div>
          <div className="card-content">
            <div className="scrollable-table">
              {tracks.map((track, index) => (
                <div key={track.id} className="music-item">
                  <div className="item-rank">{index + 1}</div>
                  <div className="item-image">
                    <img 
                      src={track.album.images[0]?.url || '/default-album.png'} 
                      alt={track.album.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-album.png';
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{track.name}</h3>
                    <p className="item-details">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="item-album">{track.album.name}</p>
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill" 
                        style={{ 
                          clipPath: `inset(0 ${100 - track.popularity}% 0 0)`
                        }}
                      ></div>
                      <div className="popularity-tooltip">
                        {track.popularity}% Popularity
                      </div>
                    </div>
                  </div>
                  <a 
                    href={track.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="spotify-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Top Artists ({artists.length})</h2>
          </div>
          <div className="card-content">
            <div className="scrollable-table">
              {artists.map((artist, index) => (
                <div key={artist.id} className="music-item">
                  <div className="item-rank">{index + 1}</div>
                  <div className="item-image">
                    <img 
                      src={artist.images[0]?.url || '/default-artist.png'} 
                      alt={artist.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-artist.png';
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <h3 className="item-name">{artist.name}</h3>
                    <p className="item-details">
                      {artist.genres?.length ? artist.genres.slice(0, 2).join(', ') : '-'}
                    </p>
                    <p className="item-followers">
                      {artist.followers.total.toLocaleString()} followers
                    </p>
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill" 
                        style={{ 
                          clipPath: `inset(0 ${100 - artist.popularity}% 0 0)`
                        }}
                      ></div>
                      <div className="popularity-tooltip">
                        {artist.popularity}% Popularity
                      </div>
                    </div>
                  </div>
                  <a 
                    href={artist.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="spotify-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Genre Pie Chart + Indie/Popularity Score */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Genre Distribution</h2>
          </div>
          <div className="card-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">📊</div>
              <p>Genre pie chart will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Indie/Popularity Score</h2>
          </div>
          <div className="card-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎯</div>
              <p>Indie vs Popularity metrics will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
