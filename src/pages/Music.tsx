import React from 'react';
import { Link } from 'react-router-dom';

const Music = () => (
  <div className="music-container">
    <h1>Music</h1>
    <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem' }}>Back to Menu</Link>
  </div>
);

export default Music; 