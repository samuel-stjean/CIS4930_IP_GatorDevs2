import React from 'react';
import Plot from './Plot'; // Renders the correct plot type
import { useGame } from '../contexts/GameContext';
import '../styles/PlotsSection.css';

// Displays the main area where player plots are shown
const PlotsSection = () => {
    // Get plot data and actions from game context
    const { plots, addPlot, coins, plotCosts } = useGame();

    // Function to handle buying a new plot
    const handleBuyPlot = () => {
        addPlot(); // GameContext handles cost check
    };

    return (
        <div className="plots-section panel">
            <h2 className="section-title">Your Land</h2>

            {/* Grid layout for all the plots */}
            <div className="plots-grid">

                {/* Map through each plot data and render it */}
                {plots.map(plotData => (
                    // Container for each plot, with ID for potential targeting
                    <div key={plotData.id} className="plot-outer-container" data-plot-id={plotData.id}>
                        <Plot plotData={plotData} />
                    </div>
                ))}

                {/* The button to purchase an additional plot */}
                <div className="plot-outer-container add-plot-container">
                    <button
                        onClick={handleBuyPlot}
                        disabled={coins < plotCosts.buyPlot} // Disable if not enough coins
                        className="add-plot-button"
                        title={`Cost: ${plotCosts.buyPlot} coins`}
                    >
                        <div style={{ textAlign: 'center' }}>+ Buy Plot</div>
                        <div style={{ textAlign: 'center' }}>
                            ({plotCosts.buyPlot} <span className="coin-icon-small" style={{ display: 'inline' }}>$</span>)
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlotsSection; 