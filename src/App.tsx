import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Music from './pages/Music';
import Fitness from './pages/Fitness';
import Health from './pages/Health';
import Games from './pages/Games';
import Anime from './pages/Anime';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const menuItems = [
  { id: 'about', label: 'About', href: '/about' },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    children: [
      { id: 'music', label: 'Music', href: '/music' },
      { id: 'fitness', label: 'Fitness', href: '/fitness' },
      { id: 'health', label: 'Health', href: '/health' },
      { id: 'games', label: 'Games', href: '/games' },
      { id: 'anime', label: 'Anime', href: '/anime' },
    ] 
  },
];

function App() {
  return (
    <Router basename="/data-hub">
      <div className="app-container">
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
    </Router>
  );
}

export default App;
