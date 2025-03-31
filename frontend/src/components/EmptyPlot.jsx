import React from 'react';
import { useGame } from '../contexts/GameContext';
// Uses styles .empty-plot-content from PlotsSection.css

// Displays an empty plot with options to convert it
const EmptyPlot = ({ plotData }) => {
    // Get conversion action and costs from context
    const { convertPlot, plotCosts, coins } = useGame();
    const { id } = plotData;

    // Handle converting to a farm
    const handleMakeFarm = () => {
        convertPlot(id, 'farm');
    };

    // Handle converting to a pen
    const handleMakePen = () => {
        convertPlot(id, 'pen');
    };

    // Check if player can afford the conversions
    const canAffordFarm = coins >= plotCosts.upgradeToFarm;
    const canAffordPen = coins >= plotCosts.upgradeToPen;

    return (
        <div className="empty-plot-content">
            <p>Empty Plot</p>
            <div className="conversion-options">
                <button
                    onClick={handleMakeFarm}
                    disabled={!canAffordFarm}
                    title={canAffordFarm ? `Cost: ${plotCosts.upgradeToFarm}` : "Not enough coins"}
                >
                    Make Farm ({plotCosts.upgradeToFarm}<span className="coin-icon-small">$</span>)
                </button>
                <button
                    onClick={handleMakePen}
                    disabled={!canAffordPen}
                    title={canAffordPen ? `Cost: ${plotCosts.upgradeToPen}` : "Not enough coins"}
                >
                    Make Pen ({plotCosts.upgradeToPen}<span className="coin-icon-small">$</span>)
                </button>
            </div>
            {/* Label (uses general .plot-label style from PlotsSection.css) - Optional */}
            {/* <div className="plot-label">Empty</div> */}
        </div>
    );
};

export default EmptyPlot; 