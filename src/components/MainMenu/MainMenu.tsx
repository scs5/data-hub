import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const menuItems = [
  { name: 'Music', path: '/music' },
  { name: 'Fitness', path: '/fitness' },
  { name: 'Health', path: '/health' },
  { name: 'Games', path: '/games' },
  { name: 'Anime', path: '/anime' },
];

const MainMenu = () => (
  <nav className="main-menu">
    {menuItems.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className="main-menu-link"
      >
        {item.name}
      </Link>
    ))}
  </nav>
);

export default MainMenu; 