import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext'; // Import context hook
import useInterval from '../hooks/useInterval';
import '../styles/Crop.css';

// Displays a single crop to go to next stage we water
const Crop = ({ cropData, plotId }) => {
    // Get harvest action and crop details from context
    const { harvestCrop, cropTypes, waterCrop, advanceCropStage } = useGame();
    const { id, type, startTime, currentStage = 0, stageStartTime = null } = cropData;
    const cropInfo = cropTypes[type];

    // State to force timer display update
    const [timerDisplay, setTimerDisplay] = useState("...");

    // Function to check stage of ctop and moves it on
    const checkStageTimer = () => {
        if (!cropInfo || stageStartTime === null) {
            const totalStages = cropInfo?.stages ?? 5;
            const isGrownCheck = currentStage >= totalStages - 1;
            setTimerDisplay(isGrownCheck ? "Ready!" : "Needs Water");
            return;
        }

        const growthTimePerStage = cropInfo.growthTimePerStage ?? 6000;
        const timeElapsed = Date.now() - stageStartTime;

        if (timeElapsed >= growthTimePerStage) {
            advanceCropStage(plotId, id);
        } else {
            const timeRemaining = Math.max(0, growthTimePerStage - timeElapsed);
            setTimerDisplay(`${Math.ceil(timeRemaining / 1000)}s`);
        }
    };

    // Update timer display immediately when component loads or data changes
    useEffect(() => {
        checkStageTimer();
    }, [cropData, cropInfo]);

    // Checks timer when a crop is growing in a new stage
    useInterval(checkStageTimer, stageStartTime !== null ? 1000 : null);

    // Handle clicking the harvest button
    const handleHarvest = () => {
        harvestCrop(plotId, id);
    };

    // logic for dropping water onto plant
    const handleDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over-target');
        const resourceType = event.dataTransfer.getData('resourceType');

        // Checks if water dropped then it waters the plant
        if (resourceType === 'water') {
            waterCrop(plotId, id);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        const totalStages = cropInfo?.stages ?? 5;

        // if no crop dropping doesnt do anything else it starts for the next stage, we keep watering until the next crop stage is dropped
        if (cropInfo && stageStartTime === null && currentStage < totalStages - 1) {
            event.dataTransfer.dropEffect = 'link';
            event.currentTarget.classList.add('drag-over-target');
        } else {
            event.dataTransfer.dropEffect = 'none';
        }
    };

    const handleDragLeave = (event) => {
        event.currentTarget.classList.remove('drag-over-target');


    };










    // Make sure we have valid crop info before rendering
    if (!cropInfo) {
        console.error("Invalid crop type:", type);
        return <div className="crop-display error">?</div>;
    }

    // Determine if the crop is fully grown
    const totalStages = cropInfo.stages ?? 5;
    const isGrown = currentStage >= totalStages - 1;

    // Select the correct image asset using currentStage
    const imageAsset = isGrown
        ? cropInfo.grownAsset
        : (cropInfo.growingAssets && cropInfo.growingAssets[currentStage]) || cropInfo.growingAssets?.[0];

    // Determine display status text (managed by checkStageTimer -> timerDisplay state)
    const displayStatus = timerDisplay;

    return (
        <div
            className="crop-display"
            title={`${cropInfo.name} - ${isGrown ? 'Ready' : `Stage ${currentStage + 1}`}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <img src={imageAsset} alt={cropInfo.name} className="crop-image" />
            {/* Display time to next stage or stage crop is at*/}
            <div className="crop-timer">{displayStatus}</div>
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