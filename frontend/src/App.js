import React, { useState } from 'react';
import GamePage from './components/GamePage.jsx';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { GameProvider } from './contexts/GameContext';
import './styles/index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("register"); // or "login", "game"

  const handleRegisterSuccess = () => {
    setView("login");
  };

  return (
    <GameProvider>
      {view === "game" && <GamePage />}
      {view === "login" && <LoginPage />}
      {view === "register" && <RegisterPage onRegisterSuccess={handleRegisterSuccess} />}
    </GameProvider>
  );
}

export default App;
