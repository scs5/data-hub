import React from 'react';
import { Link } from 'react-router-dom';

const Fitness = () => (
  <div className="fitness-container">
    <h1>Fitness</h1>
    <Link to="/" style={{ color: '#8ab4f8', marginTop: '2rem' }}>Back to Menu</Link>
  </div>
);

export default Fitness; 