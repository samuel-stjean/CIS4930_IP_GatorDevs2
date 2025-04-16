import React, { useEffect } from 'react';
// Import the main sections of the game UI
import { useNavigate } from 'react-router-dom';
import PlotsSection from './PlotsSection';
import ShopSection from './ShopSection';
import InventorySection from './InventorySection';
import ResourceBar from './ResourceBar';
// Hook to get game state and actions
import { useGame } from '../contexts/GameContext';
import ResourceCursor from './ResourceCursor'; // adjust path if needed



// This component sets up the main layout of the game page
const GamePage = () => {
    // Get current coins and the function to update them
    const { coins, updateCoins, hasLoadedInventory, saveAllGameState, setCursorPosition } = useGame();
    const navigate = useNavigate();

    // Simple cheat function to add coins for testing
    const handleCheatClick = () => {
        updateCoins(50);
        console.log("Cheat: +50 Coins added!"); // Log for feedback
    };

    const handleLogout = () => {
        saveAllGameState();
        localStorage.removeItem('playerId'); 
        navigate('/'); 
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
          setCursorPosition({ x: e.clientX, y: e.clientY });
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }, [setCursorPosition]);
    
    if (!hasLoadedInventory) {
        return <div>Loading your game data...</div>;
    }

    return (
        // The main container uses CSS Grid for layout (defined in index.css)
        <div className="game-page">

            {/* Logout button */}
            <button
                onClick={handleLogout}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '20px',
                    padding: '6px 12px',
                    backgroundColor: '#444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    zIndex: 1000
                }}
            >
                Logout
            </button>

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
            <ResourceBar/> 
            <ResourceCursor />

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