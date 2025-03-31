import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext'; // Import context hook
import useInterval from '../hooks/useInterval';
import '../styles/Crop.css'; // Create this CSS file

// Displays a single growing or grown crop
const Crop = ({ cropData, plotId }) => {
    // Get harvest action and crop details from context
    const { harvestCrop, cropTypes } = useGame();
    const { id, type, startTime } = cropData;
    const cropInfo = cropTypes[type];

    // State for the currently displayed image frame
    const [currentFrame, setCurrentFrame] = useState(0);
    // State to force timer update every second
    const [_, setTimerTick] = useState(0);

    // Function to update the visual frame and trigger timer re-render
    const updateGrowthAndTimer = () => {
        if (!cropInfo) return;

        // Update visual stage
        const totalStages = cropInfo.stages ?? 5;
        const timeElapsed = Date.now() - startTime;
        const growthTimePerStage = cropInfo.growthTimePerStage ?? 6000;
        const stage = Math.min(totalStages, Math.floor(timeElapsed / growthTimePerStage) + 1);
        setCurrentFrame(stage - 1); // Frame index is 0-based

        // Force re-render for timer update
        setTimerTick(tick => tick + 1);
    };

    // Update growth stage immediately when the component loads or crop data changes
    useEffect(() => {
        updateGrowthAndTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropData, cropInfo]);

    // Check growth stage periodically using an interval
    useInterval(updateGrowthAndTimer, 1000); // Check every second

    // Handle clicking the harvest button
    const handleHarvest = () => {
        harvestCrop(plotId, id);
    };

    // Make sure we have valid crop info before rendering
    if (!cropInfo) {
        console.error("Invalid crop type:", type);
        return <div className="crop-display error">?</div>;
    }

    // Determine if the crop is fully grown
    const totalStages = cropInfo.stages ?? 5;
    const isGrown = currentFrame >= totalStages - 1;
    // Select the correct image asset (growing frame or final grown asset)
    const imageAsset = isGrown ? cropInfo.grownAsset : cropInfo.growingAssets[currentFrame];

    // Calculate time remaining for display
    const growthTimePerStage = cropInfo.growthTimePerStage ?? 6000;
    const totalGrowthTime = totalStages * growthTimePerStage;
    const timeElapsed = Date.now() - startTime;
    const timeRemaining = isGrown ? 0 : Math.max(0, totalGrowthTime - timeElapsed);
    const displayTime = isGrown ? "Ready!" : `${Math.ceil(timeRemaining / 1000)}s`;

    return (
        <div className="crop-display" title={cropInfo.name}>
            <img src={imageAsset} alt={cropInfo.name} className="crop-image" />
            {/* Restore Timer Display */}
            <div className="crop-timer">{displayTime}</div>
            {/* Show harvest button only when fully grown */}
            {isGrown && (
                <button onClick={handleHarvest} className="harvest-button">
                    Harvest
                </button>
            )}
        </div>
    );
};

export default Crop; 