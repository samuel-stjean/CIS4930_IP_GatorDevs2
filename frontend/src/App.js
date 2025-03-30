import React from 'react';
// Correct paths relative to src/
import GamePage from './components/GamePage.jsx';
import { GameProvider } from './contexts/GameContext';
import './styles/index.css'; // Main CSS file - Ensure this path is correct

function App() {
  return (
    // Wrap the GamePage with the GameProvider so all components can access game state
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}

export default App;
