import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Music from './pages/Music';
import Fitness from './pages/Fitness';
import Health from './pages/Health';
import Games from './pages/Games';
import Anime from './pages/Anime';
import MainMenu from './components/MainMenu/MainMenu';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/music" element={<Music />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/health" element={<Health />} />
          <Route path="/games" element={<Games />} />
          <Route path="/anime" element={<Anime />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
