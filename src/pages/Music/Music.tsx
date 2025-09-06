import React, { useEffect, useState } from 'react';
import MusicLoader from '../../components/music/MusicLoader/MusicLoader';
import RecentlyPlayedTicker from '../../components/music/RecentlyPlayedTicker/RecentlyPlayedTicker';
import TimePeriodSelector from '../../components/music/TimePeriodSelector/TimePeriodSelector';
import ProfileCard from '../../components/music/ProfileCard/ProfileCard';
import DataFreshnessCard from '../../components/music/DataFreshnessCard/DataFreshnessCard';
import TopItems from '../../components/music/TopItems/TopItems';
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
  
  // Time period selector state
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isHistoricalData, setIsHistoricalData] = useState<boolean>(false);

  // Helper function to format month with leading zero
  const formatMonth = (month: number): string => {
    return month.toString().padStart(2, '0');
  };

  // Helper function to build archive URL
  const buildArchiveUrl = (dataType: 'tracks' | 'artists'): string => {
    const year = selectedYear;
    const month = formatMonth(selectedMonth);
    return `https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/archive/${year}_${month}_${dataType}.json`;
  };

  // Check if we should use historical data
  const shouldUseHistoricalData = (): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const useHistorical = shouldUseHistoricalData();
        setIsHistoricalData(useHistorical);

        // Always fetch profile data (it doesn't change based on time period)
        const profileResponse = await fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/profile/profile.json');
        if (!profileResponse.ok) throw new Error(`Profile HTTP error! status: ${profileResponse.status}`);
        const profileData: Profile = await profileResponse.json();
        setProfile(profileData);

        // Fetch artists and tracks data based on time period
        let artistsResponse: Response;
        let tracksResponse: Response;

        if (useHistorical) {
          // Use archive data
          const [artistsRes, tracksRes] = await Promise.all([
            fetch(buildArchiveUrl('artists')),
            fetch(buildArchiveUrl('tracks'))
          ]);
          artistsResponse = artistsRes;
          tracksResponse = tracksRes;
        } else {
          // Use live data
          const [artistsRes, tracksRes] = await Promise.all([
            fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json'),
            fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_tracks.json')
          ]);
          artistsResponse = artistsRes;
          tracksResponse = tracksRes;
        }

        if (!artistsResponse.ok) throw new Error(`Artists HTTP error! status: ${artistsResponse.status}`);
        if (!tracksResponse.ok) throw new Error(`Tracks HTTP error! status: ${tracksResponse.status}`);

        const artistsData: ArtistsApiResponse = await artistsResponse.json();
        const tracksData: TracksApiResponse = await tracksResponse.json();

        setArtists(artistsData.items);
        setTracks(tracksData.items);

        // Always get last-modified time for live data (for the data freshness component)
        const [profileMeta, artistsMeta, tracksMeta] = await Promise.all([
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/profile/profile.json', { method: 'HEAD' }),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_artists.json', { method: 'HEAD' }),
          fetch('https://personal-data-dashboard.s3.us-east-1.amazonaws.com/spotify/live/30_day_tracks.json', { method: 'HEAD' })
        ]);

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
  }, [selectedYear, selectedMonth]);

  if (loading) {
    return <MusicLoader />;
  }

  return (
    <div className="music-dashboard">
      {/* Row 1: Spotify Profile + Period Selector + Data Last Fetched */}
      <div className="dashboard-row dashboard-row-top">
        <ProfileCard profile={profile} />
        
        <div className="dashboard-card">
          <div className="card-content">
            <TimePeriodSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </div>

        <DataFreshnessCard lastModified={lastModified} />
      </div>

      {/* Row 2: Recently Played Ticker */}
      <div className="dashboard-row dashboard-row-full">
        <RecentlyPlayedTicker />
      </div>

      {/* Row 3: Top Tracks + Top Artists */}
      <div className="dashboard-row">
        <TopItems 
          type="tracks" 
          items={tracks} 
          title="Top Tracks" 
        />
        <TopItems 
          type="artists" 
          items={artists} 
          title="Top Artists" 
        />
      </div>

      {/* Row 4: Genre Pie Chart + Indie/Popularity Score */}
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
