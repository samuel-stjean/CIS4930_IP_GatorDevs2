import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import useInterval from '../hooks/useInterval';
import '../styles/Critter.css';

// Displays a single critter and handles its resource production timer
const Critter = ({ critterData, plotId }) => {
    // Get context functions and static data needed for critters
    const { addResourceDropToPlot, updatePlot, critterTypes, itemDetails } = useGame();
    const { id, type, lastResourceDrop } = critterData;
    const critterInfo = critterTypes[type];

    // State to display the time until the next resource drop
    const [timeToNextDrop, setTimeToNextDrop] = useState(0);

    // Function to check if it's time to drop a resource and update the timer
    const updateTimer = () => {
        if (!critterInfo) return; // Should have critter info by now

        const productionTime = critterInfo.productionTime ?? 30000; // Default 30s
        const now = Date.now();
        const timeSinceLastDrop = now - lastResourceDrop;
        const remaining = productionTime - timeSinceLastDrop;

        if (remaining <= 0) {
             // Time to drop!
             addResourceDropToPlot(plotId, critterInfo.produces);
             const newLastDropTime = Date.now();
             // Update this specific critter's last drop time in the plot state
              updatePlot(plotId, (currentPlot) => {
                 if(currentPlot.type !== 'pen' || !currentPlot.critters) return currentPlot;
                 const critterIndex = currentPlot.critters.findIndex(c => c.id === id);
                 if (critterIndex === -1) return currentPlot; // Critter not found?
                 // Create a new array with the updated critter
                 const updatedCritters = [...currentPlot.critters];
                 updatedCritters[critterIndex] = { ...updatedCritters[critterIndex], lastResourceDrop: newLastDropTime };
                 return { ...currentPlot, critters: updatedCritters };
              });
             // Reset timer for display
             setTimeToNextDrop(productionTime);
         } else {
             // Update remaining time for display
             setTimeToNextDrop(remaining);
         }
    };

    // Update the timer immediately when the component loads or dependencies change
    useEffect(() => {
        if (critterInfo) { updateTimer(); }
         // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [lastResourceDrop, critterInfo]); // Re-check if last drop time or info changes

    // Update the timer display every second
    useInterval(() => {
        if (critterInfo) { updateTimer(); }
    }, 1000);

    // --- Rendering --- //

    // Handle cases where critter info might be missing
    if (!critterInfo) {
        console.error("Invalid critter type:", type);
        return <div className="critter-display error">?</div>;
    }

    // Get the name of the item this critter produces for the tooltip
    const producedItemName = itemDetails[critterInfo.produces]?.name || 'item';

    return (
        // Tooltip shows critter name and what it produces
        <div className="critter-display" title={`${critterInfo.name} (Produces ${producedItemName})`}>
            <img src={critterInfo.asset} alt={critterInfo.name} className="critter-image" />
            {/* Display the countdown timer */}
            <div className="critter-timer">{Math.ceil(timeToNextDrop / 1000)}s</div>
        </div>
    );
};

export default Critter; 