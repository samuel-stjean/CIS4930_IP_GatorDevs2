import React, { useState } from 'react';
import '../styles/ShopSection.css';
import { useGame } from '../contexts/GameContext';
import ShopItem from './ShopItem';

// Displays the shop panel with different item categories
const ShopSection = () => {
    // Get game state needed for the shop
    const { coins, itemDetails } = useGame();
    // State to keep track of the currently selected shop tab
    const [activeTab, setActiveTab] = useState('seeds');

    // Determine which items to show based on the active tab
    const itemsToDisplay = Object.entries(itemDetails)
        // Filter by category and ensure it's buyable (has buyPrice)
        .filter(([id, details]) => details.buyPrice !== undefined && details.category === activeTab)
        // Map to the format expected by ShopItem
        .map(([id, details]) => ({ id, ...details }));

    // Available shop categories
    const tabs = ['seeds', 'eggs'];

    return (
        <div className="shop-section panel">
            <h2 className="section-title">Shop</h2>

            {/* Buttons to switch between shop categories */}
            <div className="shop-tabs">
                 {tabs.map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    >
                         {/* Capitalize the tab name for display */}
                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
                     </button>
                 ))}
            </div>

            {/* List of items currently displayed in the shop */}
            <div className="shop-items-list">
                 {itemsToDisplay.length > 0 ? (
                    // Render each buyable item
                    itemsToDisplay.map(item => (
                        <ShopItem key={item.id} item={item} coins={coins} />
                    ))
                 ) : (
                    // Message shown if a category has no items
                    <p className="empty-tab-message">
                        No items in this category.
                    </p>
                 )}
            </div>
        </div>
    );
};

export default ShopSection; 