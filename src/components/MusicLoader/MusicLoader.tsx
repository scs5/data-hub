import React from 'react';
import './MusicLoader.css';

const MusicLoader: React.FC = () => {
  return (
    <div className="music-loader">
      <div className="music">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default MusicLoader;
