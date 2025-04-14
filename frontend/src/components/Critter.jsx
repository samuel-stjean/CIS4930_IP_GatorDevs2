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
    const [isTimerActive, setIsTimerActive] = useState(false);

    const [localDropTime, setLocalDropTime] = useState(null); //I had issues with the drop times being all over the place so Im using a local value 
    // Function to check if it's time to drop a resource and update the timer
    const updateTimer = () => {
        if (!critterInfo) return; // Should have critter info by now

        const productionTime = critterInfo.productionTime ?? 30000; // Default 30s

        const baseTime = (isTimerActive && localDropTime !== null) ? localDropTime : lastResourceDrop; //


        const now = Date.now();
        const timeSinceLastDrop = now - baseTime;
        const remaining = productionTime - timeSinceLastDrop;

        if (remaining <= 0) {
             // Time to drop!
             addResourceDropToPlot(plotId, critterInfo.produces);
             //const newLastDropTime = Date.now();
             // Update this specific critter's last drop time in the plot state
              updatePlot(plotId, (currentPlot) => {
                 if(currentPlot.type !== 'pen' || !currentPlot.critters) return currentPlot;
                 const critterIndex = currentPlot.critters.findIndex(c => c.id === id);
                 if (critterIndex === -1) return currentPlot; // Critter not foun?
                 // Create a new array with the updated critterd?
                
                 const updatedCritters = [...currentPlot.critters];
                 updatedCritters[critterIndex] = { ...updatedCritters[critterIndex], lastResourceDrop: Date.now() };
                 return { ...currentPlot, critters: updatedCritters };
              });
             // Restart the timer from 30 every time a resource is dropped
             setIsTimerActive(false);
             setTimeToNextDrop(productionTime);
             setLocalDropTime(null); // Reset local drop time

         } else {
             // Update remaining time for display
             setTimeToNextDrop(remaining);
         }
    };

    // Update the timer immediately when the component loads or dependencies change
    useEffect(() => {
        if (critterInfo && isTimerActive) { updateTimer(); }
         // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [lastResourceDrop, critterInfo,isTimerActive]); // Re-check if last drop time or info changes

    // Update the timer display every second
    useInterval(() => {
        if (critterInfo && isTimerActive) { updateTimer(); }
    }, 1000);


    const handleDrop = (event) => {
        event.preventDefault();
        const resourceType = event.dataTransfer.getData('resourceType');
        if (resourceType === 'food') {
          setLocalDropTime(Date.now());
          setIsTimerActive(true); // Start the timer when food is dropped
          setTimeToNextDrop(30000);
        }
      };
    
    const handleDragOver = (event) => {
        event.preventDefault(); // Allow dropping
    };

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
        <div
        className="critter-display"
        title={`${critterInfo.name} (Produces ${producedItemName})`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <img src={critterInfo.asset} alt={critterInfo.name} className="critter-image" />
        <div className="critter-timer">{isTimerActive ? `${Math.ceil(timeToNextDrop / 1000)}s` : 'Needs Food'}</div>
      </div>
    );
};

export default Critter; 