import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/InventoryItem.css'; // Specific styles

// Displays a single item stack in the player's inventory grid
const InventoryItem = ({ item, onClick }) => {
    // Get static item details from context
    const { itemDetails } = useGame();
    const { id, quantity } = item;
    const details = itemDetails[id];

    // Handle missing item details (shouldn't happen normally)
    if (!details) {
        console.warn(`Missing details for item ID: ${id}`);
        return (
            <div className="inventory-item missing-item">
                ? ({quantity})
            </div>
        );
    }

    // Determine if the item is sellable to apply specific styles/behavior
    const isSellable = details.sellPrice !== undefined;

    return (
        <div
            className={`inventory-item ${isSellable ? 'sellable' : ''}`}
            onClick={isSellable ? onClick : undefined} // Only trigger onClick if sellable
            title={`${details.name} (x${quantity})${isSellable ? ' - Click to Sell' : ''}`}
        >
            <div className="inventory-item-icon">
                {details.icon ? <img src={details.icon} alt={details.name} /> : 'I'}
            </div>
            <span className="inventory-item-quantity">{quantity}</span>
        </div>
    );
};

export default InventoryItem; 