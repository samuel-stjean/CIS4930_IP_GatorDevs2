import React from 'react';
import Critter from './Critter'; // Renders individual critters
import ResourceDrop from './ResourceDrop'; // Renders collectable resources
import { useGame } from '../contexts/GameContext';
import '../styles/PenPlot.css'; // Specific styles for pens

// Displays a critter pen plot with critters, resources, and adding controls
const PenPlot = ({ plotData }) => {
    // Get data and actions needed for the pen
    const { inventory, addCritter, critterTypes, itemDetails } = useGame();
    // Default critters/resources to empty arrays if undefined
    const { id, critters = [], resources = [] } = plotData;

    // Find which critter eggs the player has in inventory
    const availableEggs = Object.entries(inventory)
        .map(([itemId, quantity]) => {
            const details = itemDetails[itemId];
            // Check if it's an egg and quantity > 0
            if (quantity > 0 && details && details.category === 'eggs') {
                // Find which critter type this egg belongs to
                const critterTypeKey = Object.keys(critterTypes).find(key => critterTypes[key].eggId === itemId);
                if (critterTypeKey) {
                    return { eggId: itemId, name: details.name, critterType: critterTypeKey, icon: details.icon };
                }
            }
            return null;
        })
        .filter(egg => egg !== null); // Remove non-egg entries

    // Determine the pen's capacity (using base capacity)
    // Use the type of the first critter, or default (e.g., 'slime') if empty
    const critterTypeKey = critters.length > 0 ? critters[0].type : 'slime';
    const capacity = critterTypes[critterTypeKey]?.penCapacity ?? 3; // Default to 3 if undefined
    const canAddCritter = critters.length < capacity;

    // Function to add a critter using an egg
    const handleAddCritter = (critterTypeToAdd) => {
        if (canAddCritter) {
            addCritter(id, critterTypeToAdd); // Context handles inventory/plot updates
        }
    };

    return (
        <div className="pen-plot-content">
            {/* Area where critters are displayed */}
            <div className="critter-area">
                {critters.map(critter => (
                    <Critter key={critter.id} critterData={critter} plotId={id} />
                ))}
            </div>

            {/* Display collectable resources that have dropped */}
            <div className="resource-area">
                {resources.map((resource, index) => (
                    < ResourceDrop key={`${resource.id}-${index}`} resourceData={resource} plotId={id} />
                ))}
            </div>


            {/* Buttons to add new critters if space and eggs are available */}
            {canAddCritter && (
                 <div className="add-critter-controls">
                    {availableEggs.map(egg => (
                        <button
                            key={egg.eggId}
                            onClick={() => handleAddCritter(egg.critterType)}
                            title={`Add ${critterTypes[egg.critterType].name}`}
                        >
                             <img src={egg.icon} alt={egg.name} />
                         </button>
                    ))}
                 </div>
             )}

            {/* Label showing current occupancy vs. capacity */}
            <div className="plot-label">Pen ({critters.length}/{capacity})</div>
        </div>
    );
};

export default PenPlot; 