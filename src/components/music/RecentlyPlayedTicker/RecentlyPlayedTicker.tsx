import React, { useEffect, useState } from 'react';
import './RecentlyPlayedTicker.css';

interface RecentlyPlayedTrack {
  track: {
    id: string;
    name: string;
    artists: { name: string; id: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    external_urls: { spotify: string };
  };
  played_at: string;
}

interface RecentlyPlayedResponse {
  items: RecentlyPlayedTrack[];
}

const RecentlyPlayedTicker: React.FC = () => {
  const [tracks, setTracks] = useState<RecentlyPlayedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const response = await fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/profile/recently_played.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: RecentlyPlayedResponse = await response.json();
        
        // Check if the response structure is different than expected
        if (!data.items) {
          // Try to find tracks in a different property
          const possibleItems = (data as any).tracks || (data as any).recent || (data as any).history || [];
          if (possibleItems.length > 0) {
            (data as any).items = possibleItems;
          }
        }
        
        // Filter out items with missing required data and take only top 20
        const validTracks = (data.items || []).filter(item => 
          item && 
          item.track && 
          item.track.id && 
          item.track.name && 
          item.track.artists && 
          item.track.artists.length > 0 &&
          item.track.album && 
          item.track.album.name
        ).slice(0, 20);
        
        setTracks(validTracks);
      } catch (err) {
        console.error('Failed to fetch recently played tracks:', err);
        if (err instanceof Error) {
          setError(`Failed to load recently played tracks: ${err.message}`);
        } else {
          setError('Failed to load recently played tracks');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, []);

  const formatPlayedAt = (playedAt: string): string => {
    const date = new Date(playedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="recently-played-ticker loading">
        <div className="ticker-content">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recently-played-ticker error">
        <div className="ticker-content">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="recently-played-ticker empty">
        <div className="ticker-content">
          <div className="empty-message">
            <span className="empty-icon">🎵</span>
            <span>No recently played tracks</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recently-played-ticker">
             <div className="ticker-header">
         <h3>Recently Played</h3>
       </div>
      <div className="ticker-container">
        <div className="ticker-track">
          <div className="ticker-content">
            {tracks.map((item, index) => (
              <div key={`${item.track.id}-${index}`} className="ticker-item">
                <div className="track-image">
                  <img 
                    src={item.track.album.images && item.track.album.images.length > 0 ? item.track.album.images[0].url : '/default-album.png'} 
                    alt={item.track.album.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-album.png';
                    }}
                  />
                </div>
                <div className="track-info">
                  <div className="track-name">{item.track.name}</div>
                  <div className="track-artist">
                    {item.track.artists.map(artist => artist.name).join(', ')}
                  </div>
                  <div className="track-album">{item.track.album.name}</div>
                </div>
                <div className="track-time">{formatPlayedAt(item.played_at)}</div>
                <a 
                  href={item.track.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="track-spotify-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm1.44-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
            ))}
            {/* Duplicate tracks for seamless loop */}
            {tracks.map((item, index) => (
              <div key={`${item.track.id}-${index}-duplicate`} className="ticker-item">
                <div className="track-image">
                  <img 
                    src={item.track.album.images && item.track.album.images.length > 0 ? item.track.album.images[0].url : '/default-album.png'} 
                    alt={item.track.album.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-album.png';
                    }}
                  />
                </div>
                <div className="track-info">
                  <div className="track-name">{item.track.name}</div>
                  <div className="track-artist">
                    {item.track.artists.map(artist => artist.name).join(', ')}
                  </div>
                  <div className="track-album">{item.track.album.name}</div>
                </div>
                <div className="track-time">{formatPlayedAt(item.played_at)}</div>
                <a 
                  href={item.track.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="track-spotify-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm1.44-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayedTicker;
