import React, { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/SellPopup.css'; // Specific styles

// Popup menu for selling items from inventory
const SellPopup = ({ itemId, x, y, onClose }) => {
    // Get inventory data, sell action, and item details
    const { inventory, sellInventoryItem, itemDetails } = useGame();
    const popupRef = useRef(null); // Ref to the popup element

    // Get details for the selected item
    const item = itemDetails[itemId];
    const currentQuantity = inventory[itemId] || 0;

    // Close popup if item data is missing or quantity is zero
    useEffect(() => {
        if (!item || currentQuantity <= 0) {
            onClose();
        }
    }, [item, currentQuantity, onClose]);

    // Add event listener to close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the popup element
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose(); // Call the close handler passed from parent
            }
        };
        // Add listener on mount
        document.addEventListener('mousedown', handleClickOutside);
        // Clean up listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]); // Re-add listener if onClose changes

    // Handle selling one item
    const handleSellOne = () => {
        sellInventoryItem(itemId, 1);
        // Popup might close automatically due to inventory update, or keep it open?
        // For now, let it close due to useEffect check above.
    };

    // Handle selling all items of this type
    const handleSellAll = () => {
        sellInventoryItem(itemId, currentQuantity);
        // Popup will close due to useEffect check.
    };

    // Don't render if item details are missing
    if (!item) return null;

    // Style to position the popup near the clicked inventory item
    const popupStyle = {
        position: 'fixed', // Use fixed positioning for viewport coordinates
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)', // Adjusts so popup appears above and centered
        zIndex: 1100, // Ensure popup is on top of other elements
    };

    return (
        <div className="sell-popup" ref={popupRef} style={popupStyle}>
            <p className="popup-item-name">{item.name} ({currentQuantity})</p>
            <div className="popup-buttons">
                <button
                    onClick={handleSellOne}
                    disabled={currentQuantity < 1}
                >
                    Sell 1 ({item.sellPrice}$)
                </button>
                <button
                    onClick={handleSellAll}
                    disabled={currentQuantity < 1}
                >
                    Sell All ({item.sellPrice * currentQuantity}$)
                </button>
            </div>
            {/* Optional: Close button if needed */}
            {/* <button onClick={onClose} className="close-popup-button">&times;</button> */}
        </div>
    );
};

export default SellPopup; 