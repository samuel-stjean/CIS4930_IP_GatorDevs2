import React from 'react';
import Crop from './Crop'; // Renders individual crops
import { useGame, cropTypes } from '../contexts/GameContext';
import '../styles/FarmPlot.css'; // Specific styles for farms

// Displays a farm plot with spaces for crops and planting controls
const FarmPlot = ({ plotData }) => {
    // Get inventory, item details, and plant action from context
    const { inventory, itemDetails, plantCrop } = useGame();
    const { id, crops = [] } = plotData;
    const farmCapacity = 2; // Farms can hold 2 crops

    // Find available seeds in the inventory
    const availableSeeds = Object.entries(inventory)
        .map(([itemId, quantity]) => {
            const details = itemDetails[itemId];
            // Check if it's a seed item
            if (quantity > 0 && details && details.category === 'seeds') {
                 // Find which crop type uses this itemId as its seedId
                 const cropTypeEntry = Object.entries(cropTypes).find(([, cropData]) => cropData.seedId === itemId);
                 if (cropTypeEntry) {
                     const [cropTypeKey] = cropTypeEntry;
                     return { seedId: itemId, name: details.name, cropType: cropTypeKey };
                 }
            }
            return null;
        })
        .filter(seed => seed !== null); // Filter out non-seed items

    // Handle planting a specific seed in a specific spot
    const handlePlant = (cropTypeKey, spotIndex) => {
        plantCrop(id, cropTypeKey, spotIndex);
    };

    // Create visual representation for each spot (crop or empty)
    const renderSpot = (spotIndex) => {
        const crop = crops[spotIndex];
        if (crop) {
            // If a crop exists, render the Crop component
            return <Crop key={crop.id} cropData={crop} plotId={id} />;
        } else {
            // If the spot is empty, show planting buttons for available seeds
            return (
                <div className="empty-crop-spot">
                    {availableSeeds.length > 0 ? (
                        availableSeeds.map(seed => (
                            <button
                                key={seed.seedId}
                                onClick={() => handlePlant(seed.cropType, spotIndex)}
                                className="plant-button"
                                title={`Plant ${seed.name}`}
                            >
                                <img src={itemDetails[seed.seedId]?.icon} alt={seed.name} />
                            </button>
                        ))
                    ) : (
                        <span className="no-seeds-text">No seeds</span>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="farm-plot-content">
            {/* Display the two crop spots */}
            <div className="crop-spots-container">
                {renderSpot(0)}
                {renderSpot(1)}
            </div>
            <div className="plot-label">Farm</div>
        </div>
    );
};

export default FarmPlot; 