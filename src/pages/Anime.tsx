import React from 'react';
import { Link } from 'react-router-dom';

const Anime = () => (
  <div className="anime-container">
    <h1>Anime</h1>
    <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem' }}>Back to Menu</Link>
  </div>
);

export default Anime; 