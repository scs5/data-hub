import React from 'react';
import './DataFreshnessCard.css';

interface DataFreshnessCardProps {
  lastModified: Date | null;
}

const DataFreshnessCard: React.FC<DataFreshnessCardProps> = ({ lastModified }) => {
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

  return (
    <div className="data-freshness-card">
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
  );
};

export default DataFreshnessCard;
