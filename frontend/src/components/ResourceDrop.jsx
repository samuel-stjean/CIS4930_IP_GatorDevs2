import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/ResourceDrop.css'; // Specific styles

// Displays a single collectable resource dropped by a critter
const ResourceDrop = ({ resourceData, plotId }) => {
    // Get actions and item details from context
    const { removeResourceDropFromPlot, updateInventory, itemDetails } = useGame();
    const { id, type, x, y } = resourceData;

    // Get the details (name, icon) for this resource type
    const itemInfo = itemDetails[type];

    // Handle hovering over the resource to collect it
    const handleMouseEnter = () => {
        removeResourceDropFromPlot(plotId, id);
        updateInventory(type, 1);
        // Optional: Add visual/audio feedback for collection
    };

    // Basic error handling if item details are somehow missing
    if (!itemInfo) {
        console.warn(`Missing details for resource type: ${type}`);
        return null; // Don't render if we don't know what it is
    }

    // Position the drop within the pen using percentage
    const dropStyle = {
        left: `${x}%`,
        top: `${y}%`,
    };

    // Use the item's icon, or a placeholder if missing
    const iconContent = itemInfo.icon
        ? <img src={itemInfo.icon} alt={itemInfo.name} draggable="false" />
        : '?';

    return (
        // Using a button for interaction, though it looks like an icon
        <button
            className="resource-drop"
            style={dropStyle}
            onMouseEnter={handleMouseEnter} // Collect on hover
            title={`Collect ${itemInfo.name}`} // Tooltip for accessibility
            draggable="false" // Prevent accidental dragging
        >
            {iconContent}
        </button>
    );
};

export default ResourceDrop; 