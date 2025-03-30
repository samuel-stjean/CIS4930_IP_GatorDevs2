import React from 'react';
import EmptyPlot from './EmptyPlot';
import FarmPlot from './FarmPlot';
import PenPlot from './PenPlot';
// Uses styles defined in PlotsSection.css for .plot-container, .plot-label etc.

// This component acts like a router, deciding which type of plot to render.
const Plot = ({ plotData }) => {
    // Destructure the type from the plot data
    const { type } = plotData;

    // Render the correct component based on the plot type
    switch (type) {
        case 'empty':
            return <EmptyPlot plotData={plotData} />;
        case 'farm':
            return <FarmPlot plotData={plotData} />;
        case 'pen':
            return <PenPlot plotData={plotData} />;
        default:
            // Fallback for unknown plot types
            console.warn("Unknown plot type:", type);
            return <div className="plot-container unknown">?</div>;
    }
};

export default Plot; 