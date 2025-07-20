import React from 'react';
import { Link } from 'react-router-dom';

const Health = () => (
  <div className="health-container">
    <h1>Health</h1>
    <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem' }}>Back to Menu</Link>
  </div>
);

export default Health; 