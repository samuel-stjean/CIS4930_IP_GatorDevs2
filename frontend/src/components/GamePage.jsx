import React from 'react';
// Import the main sections of the game UI
import PlotsSection from './PlotsSection';
import ShopSection from './ShopSection';
import InventorySection from './InventorySection';
// Hook to get game state and actions
import { useGame } from '../contexts/GameContext';

// This component sets up the main layout of the game page
const GamePage = () => {
    // Get current coins and the function to update them
    const { coins, updateCoins } = useGame();

    // Simple cheat function to add coins for testing
    const handleCheatClick = () => {
        updateCoins(50);
        console.log("Cheat: +50 Coins added!"); // Log for feedback
    };

    return (
        // The main container uses CSS Grid for layout (defined in index.css)
        <div className="game-page">

            {/* Area to display the player's current coin count */}
            <div className="coin-display-area">
                <span className="coin-display">
                    {coins} <span className="coin-icon">$</span>
                </span>
            </div>

            {/* Render the main game sections */}
            <PlotsSection />
            <ShopSection />
            <InventorySection />

            {/* A floating cheat button for easily adding coins during development */}
            <button
                onClick={handleCheatClick}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000, // Make sure it's on top
                    padding: '10px 15px',
                    backgroundColor: '#ff6b6b', // Fun red color
                    borderColor: '#c44d4d'
                }}
                title="Add 50 Coins"
            >
                +50 Coins
            </button>
        </div>
    );
};

export default GamePage; 