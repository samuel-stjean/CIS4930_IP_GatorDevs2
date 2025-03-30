import React from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/ShopItem.css'; // Create this

// Displays a single buyable item in the shop
const ShopItem = ({ item, coins }) => {
    // Get the buy action from context
    const { buyShopItem } = useGame();
    // Destructure item properties
    const { id, name, buyPrice, icon } = item;

    // Determine if the player can afford this item
    const canAfford = coins >= buyPrice;

    // Handle clicking the buy button
    const handleBuy = () => {
        if (canAfford) {
            buyShopItem(id);
        }
    };

    return (
        <div className={`shop-item ${!canAfford ? 'cannot-afford' : ''}`}>
            <div className="shop-item-icon">
                {icon ? <img src={icon} alt={name} /> : 'I'}
            </div>
            <div className="shop-item-details">
                <span className="shop-item-name">{name}</span>
                <span className="shop-item-cost">
                    {buyPrice} <span className="coin-icon-small">$</span>
                </span>
            </div>
            <button
                onClick={handleBuy}
                disabled={!canAfford}
                className="shop-item-buy-button"
            >
                Buy
            </button>
        </div>
    );
};

export default ShopItem; 