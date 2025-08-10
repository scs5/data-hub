import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Music from './pages/Music/Music';
import Fitness from './pages/Fitness/Fitness';
import Health from './pages/Health/Health';
import Games from './pages/Games/Games';
import Anime from './pages/Anime/Anime';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const menuItems = [
  { id: 'about', label: 'About', href: '/about' },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    children: [
      { id: 'music', label: 'Music', href: '/music', icon: 'ri-music-2-fill' },
      { id: 'fitness', label: 'Fitness', href: '/fitness', icon: 'ri-run-line' },
      { id: 'health', label: 'Health', href: '/health', icon: 'ri-heart-pulse-fill' },
      { id: 'games', label: 'Games', href: '/games', icon: 'ri-gamepad-fill' },
      { id: 'anime', label: 'Anime', href: '/anime', icon: 'ri-tv-fill' },
    ] 
  },
];

// Component to handle route changes and update background
function AppContent() {
  const location = useLocation();
  const [currentBackground, setCurrentBackground] = useState('var(--background-default)');

  useEffect(() => {
    const path = location.pathname;
    let background = 'var(--background-default)'; // default background
    
    switch (path) {
      case '/music':
        background = 'var(--background-music)';
        break;
      case '/fitness':
        background = 'var(--background-fitness)';
        break;
      case '/health':
        background = 'var(--background-health)';
        break;
      case '/games':
        background = 'var(--background-games)';
        break;
      case '/anime':
        background = 'var(--background-anime)';
        break;
      default:
        background = 'var(--background-default)';
    }
    
    setCurrentBackground(background);
  }, [location]);

  return (
    <div className="app-container" style={{ background: currentBackground }}>
      <NavBar menuItems={menuItems} />
      <main className="main-content">
        <Routes>
          <Route path="/music" element={<Music />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/health" element={<Health />} />
          <Route path="/games" element={<Games />} />
          <Route path="/anime" element={<Anime />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename="/data-hub">
      <AppContent />
    </Router>
  );
}

export default App;
