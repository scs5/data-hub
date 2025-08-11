import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MusicLoader from '../../components/MusicLoader/MusicLoader';
import './Music.css';

interface Profile {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
  country: string;
  external_urls: { spotify: string };
}

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastModified, setLastModified] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data and metadata in parallel
        const [profileResponse, artistsResponse, tracksResponse, profileMeta, artistsMeta, tracksMeta] = await Promise.all([
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/profile/profile.json'),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json'),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_tracks.json'),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/profile/profile.json', { method: 'HEAD' }),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json', { method: 'HEAD' }),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_tracks.json', { method: 'HEAD' })
        ]);

        if (!profileResponse.ok) throw new Error(`Profile HTTP error! status: ${profileResponse.status}`);
        if (!artistsResponse.ok) throw new Error(`Artists HTTP error! status: ${artistsResponse.status}`);
        if (!tracksResponse.ok) throw new Error(`Tracks HTTP error! status: ${tracksResponse.status}`);

        const profileData: Profile = await profileResponse.json();
        const artistsData: ArtistsApiResponse = await artistsResponse.json();
        const tracksData: TracksApiResponse = await tracksResponse.json();

        setProfile(profileData);
        setArtists(artistsData.items);
        setTracks(tracksData.items);

        // Get the most recent last-modified time from all three objects
        const lastModifiedTimes = [
          profileMeta.headers.get('last-modified'),
          artistsMeta.headers.get('last-modified'),
          tracksMeta.headers.get('last-modified')
        ].filter(Boolean).map(time => new Date(time!));

        if (lastModifiedTimes.length > 0) {
          const mostRecent = new Date(Math.max(...lastModifiedTimes.map(time => time.getTime())));
          setLastModified(mostRecent);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatLastModified = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isDataHealthy = (lastModified: Date | null): boolean => {
    if (!lastModified) return false;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60));
    return diffInMinutes < 24 * 60; // Data is considered fresh if less than 24 hours old
  };

  if (loading) {
    return <MusicLoader />;
  }

  return (
    <div className="music-dashboard">
      {/* Row 1: Spotify Profile + Period Selector + Data Last Fetched */}
      <div className="dashboard-row dashboard-row-top">
        <div className="dashboard-card">
          <div className="card-content">
            {profile ? (
              <div className="profile-section">
                <div className="profile-image">
                  <a 
                    href={profile.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-image-link"
                  >
                    <img 
                      src={profile.images[0]?.url || '/default-profile.png'} 
                      alt={profile.display_name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-profile.png';
                      }}
                    />
                  </a>
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{profile.display_name}</h3>
                  <p className="profile-followers">
                    {profile.followers.total.toLocaleString()} followers
                  </p>
                  <a 
                    href={profile.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-spotify-link desktop-only"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm1.44-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span>Profile</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="placeholder-content">
                <div className="placeholder-icon">🎵</div>
                <p>Profile information will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-content">
            <div className="placeholder-content">
              <div className="placeholder-icon">📅</div>
              <p>Time period selection will appear here</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            {lastModified ? (
              <div className="data-freshness-section">
                <div className="last-fetched-info">
                  <p className="last-fetched-label">Last updated:</p>
                  <p className="last-fetched-time">{formatLastModified(lastModified)}</p>
                  <p className="last-fetched-ago">{formatTimeAgo(lastModified)}</p>
                  <div className="health-indicator">
                    {isDataHealthy(lastModified) ? (
                      <span className="health-status healthy">
                        <span className="status-text">Data is fresh</span>
                      </span>
                    ) : (
                      <span className="health-status stale">
                        <span className="status-text">Data may be stale</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="placeholder-content">
                <div className="placeholder-icon">🕒</div>
                <p>Data last fetched will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Top Tracks + Top Artists */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Top Tracks</h2>
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
            <h2>Top Artists</h2>
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
