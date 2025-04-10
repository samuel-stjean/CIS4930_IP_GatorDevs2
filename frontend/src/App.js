import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from './components/GamePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import { GameProvider } from './contexts/GameContext';
import './styles/index.css';

function App() {
  const playerId = localStorage.getItem('playerId'); // 👈 force GameProvider to re-init per player

  return (
    <GameProvider key={playerId}>
      <Router basename="/~samuel.stjean/Critter_Keeper">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
