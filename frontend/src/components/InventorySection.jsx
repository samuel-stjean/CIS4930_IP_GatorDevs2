import React, { useState, useRef, useEffect } from 'react';
import '../styles/InventorySection.css'; // Create this CSS file
import { useGame } from '../contexts/GameContext';
import InventoryItem from './InventoryItem'; // Displays a single item stack
import SellPopup from './SellPopup'; // Popup for selling items

// Displays the player's inventory at the bottom of the screen
const InventorySection = () => {
    // Get inventory data and item details from game context
    const { inventory, itemDetails } = useGame();
    // State to manage the sell popup (which item is selected, where to show it)
    const [popupState, setPopupState] = useState({ visible: false, itemId: null, x: 0, y: 0 });
    const sectionRef = useRef(null); // Ref for the inventory section

    // Handle clicking on an inventory item
    const handleItemClick = (event, itemId) => {
        const item = itemDetails[itemId];
        // Only show popup for items that can be sold
        if (item && item.sellPrice !== undefined) {
            const rect = event.currentTarget.getBoundingClientRect();
            setPopupState({
                visible: true,
                itemId: itemId,
                // Position popup slightly above the clicked item
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY - 10 // Adjust vertical offset as needed
            });
        } else {
            // If item not sellable, ensure popup is hidden
            handleClosePopup();
        }
    };

    // Close the sell popup
    const handleClosePopup = () => {
        setPopupState({ visible: false, itemId: null, x: 0, y: 0 });
    };

    // Effect to handle clicking outside the popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the popup is visible and the click is outside the popup area
            // and also not on an inventory item itself (to prevent immediate reopening)
            if (popupState.visible && !event.target.closest('.sell-popup') && !event.target.closest('.inventory-item')) {
                handleClosePopup();
            }
        };

        if (popupState.visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup listener on component unmount or when popup closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupState.visible]); // Only re-run if visibility changes

    // Get a list of items currently in the player's inventory
    const inventoryItems = Object.entries(inventory)
        .map(([id, quantity]) => ({ id, quantity }))
        .filter(item => item.quantity > 0); // Only show items with quantity > 0

    return (
        <div className="inventory-section panel" ref={sectionRef}>
            <h2 className="section-title">Inventory</h2>
            {/* Grid display for inventory items */}
            <div className="inventory-grid">
                {inventoryItems.length > 0 ? (
                    inventoryItems.map(item => (
                        <InventoryItem
                            key={item.id}
                            item={item}
                            onClick={(e) => handleItemClick(e, item.id)}
                        />
                    ))
                ) : (
                    <p className="empty-inventory-message">Your inventory is empty.</p>
                )}
            </div>

            {/* Render the sell popup conditionally */}
            {popupState.visible && (
                <SellPopup
                    itemId={popupState.itemId}
                    x={popupState.x}
                    y={popupState.y}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default InventorySection; 