import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Game data configuration
import {
    itemDetails as staticItemDetails,
    critterTypes as staticCritterTypes,
    cropTypes as staticCropTypes,
    plotCosts as staticPlotCosts,
    initialPlots,
    initialInventory,
    initialCoins,
} from '../config/gameData';
// Custom hook for handling intervals cleanly
import { saveInventory, loadInventory, savePlayerCoins, fetchPlayerById, savePlots, loadPlots } from '../api';
const GameContext = createContext();

// Hook for components to easily access game state and actions
export const useGame = () => useContext(GameContext);

// Re-export static data for convenience elsewhere, if needed
export const itemDetails = staticItemDetails;
export const critterTypes = staticCritterTypes;
export const cropTypes = staticCropTypes;
export const plotCosts = staticPlotCosts;



// --- Game Provider Component: Wraps the whole game --- //
export const GameProvider = ({ children }) => {
    // --- Core Game State --- //
    const [plots, setPlots] = useState(initialPlots);
    const [inventory, setInventory] = useState(initialInventory);
    const [coins, setCoins] = useState(initialCoins);
    const [hasLoadedInventory, setHasLoadedInventory] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });



    //const playerId = 1; // TEMP: set your test player's ID
    const [playerId, setPlayerId] = useState(null);
        useEffect(() => {
        const stored = localStorage.getItem('playerId');
            if (stored) {
                setHasLoadedInventory(false);
                setPlayerId(parseInt(stored, 10));
            }
        }, []);
      

        useEffect(() => {
            if (!playerId) return;
    
            async function resetGameStateForPlayer() {
                try {
                    const player = await fetchPlayerById(playerId);
                    if (player?.Coins !== undefined) {
                        setCoins(player.Coins);
                    } else {
                        setCoins(initialCoins);
                    }
    
                    const data = await loadInventory(playerId);
                    const mapped = {};
                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            if (item.ItemName && item.Quantity !== undefined) {
                                mapped[item.ItemName] = parseInt(item.Quantity, 10);
                            }
                        });
                    }
    
                    setInventory(mapped);
                    const loadedPlots = await loadPlots(playerId);
                    if (Array.isArray(loadedPlots) && loadedPlots.length > 0) {
                        setPlots(loadedPlots);
                        if (playerId) savePlots(playerId, loadedPlots);

                    } else {
                        setPlots(initialPlots);
                    }

                } catch (err) {
                    console.error("Failed to reset game state:", err);
                } finally {
                    setHasLoadedInventory(true);
                }
            }
    
            resetGameStateForPlayer();
        }, [playerId]);

      const updateCoins = useCallback((amount) => {
        setCoins(prev => {
          const updated = prev + amount;
          savePlayerCoins(playerId, updated);
          return updated;
        });
      }, [playerId]); 
    

    // Update the quantity of an item in the inventory
    const updateInventory = useCallback((itemId, quantity) => {
        setInventory(prev => {
          const newInventory = { ...prev };
          const currentQuantity = newInventory[itemId] || 0;
          const newQuantity = currentQuantity + quantity;
      
          if (newQuantity <= 0) {
            delete newInventory[itemId];
          } else {
            newInventory[itemId] = newQuantity;
          }
      
          // Save the updated inventory
          const inventoryArray = Object.entries(newInventory).map(([ItemName, Quantity]) => ({
            ItemName,
            Quantity,
          }));
      
          if (playerId) {
            saveInventory(playerId, inventoryArray);
          }
      
          return newInventory;
        });
      }, [playerId]);
      

    // Update a specific plot's data
    // Accepts either an object with changes to merge,
    // or a function that receives the current plot and returns the updated plot.
    const updatePlot = useCallback((plotId, changes) => {
        setPlots(prevPlots => {
            const updated = prevPlots.map(plot => {
                if (plot.id === plotId) {
                    return typeof changes === 'function' ? changes(plot) : { ...plot, ...changes };
                }
                return plot;
            });
            if (playerId) savePlots(playerId, updated);
            return updated;
        });
        
     }, []);

     // --- Plot Management Actions --- //

     // Add a new, empty plot if the player has enough coins
     const addPlot = useCallback(() => {
         if (coins >= plotCosts.buyPlot) {
             updateCoins(-plotCosts.buyPlot);
             // Create a new plot object with a unique ID
             setPlots(prev => {
                const updated = [...prev, { id: `plot_${Date.now()}`, type: 'empty' }];
                if (playerId) savePlots(playerId, updated);
                return updated;
            });
            
         } else {
              console.warn("Not enough coins to buy plot!");
         }
    }, [coins, updateCoins]); // Depends on current coins

    // Add a collectable resource icon (like slime goo) to a pen
    const addResourceDropToPlot = useCallback((plotId, resourceType) => {
        updatePlot(plotId, (plot) => {
             if (plot.type === 'pen') {
                 // Give the resource a unique ID and random position within the pen
                const newResource = {
                    id: `res_${Date.now()}`,
                    type: resourceType,
                    x: Math.random() * 80 + 10, // % position (10% to 90%)
                    y: Math.random() * 80 + 10  // % position (10% to 90%)
                };
                 return { ...plot, resources: [...(plot.resources || []), newResource] };
             }
             return plot; // Don't change non-pen plots
         });
    }, [updatePlot]);

    // Remove a specific resource drop after it's been collected
    const removeResourceDropFromPlot = useCallback((plotId, resourceId) => {
         updatePlot(plotId, (plot) => {
             if (plot.type === 'pen') {
                 // Filter out the resource with the matching ID
                 return { ...plot, resources: (plot.resources || []).filter(res => res.id !== resourceId) };
             }
             return plot; // Don't change non-pen plots
         });
     }, [updatePlot]);

    // Plant a seed in a specific farm plot spot (0 or 1)
    const plantCrop = useCallback((plotId, cropType, spotIndex = -1) => {
        const seedId = staticCropTypes[cropType]?.seedId;
        // Check if the player has the required seed
        if (!seedId || (inventory[seedId] || 0) < 1) {
            console.warn("Not enough seeds!");
            return false;
        }

        let success = false;
        updatePlot(plotId, (plot) => {
           if (plot.type === 'farm') {
               const currentCrops = plot.crops || [];
               const farmCapacity = 2; // Farms hold 2 crops
               let targetSpot = spotIndex;

               // If no specific spot was requested, find the first empty one
               if (targetSpot === -1) {
                   if (!currentCrops[0]) targetSpot = 0;
                   else if (!currentCrops[1]) targetSpot = 1;
               }

               // Make sure the target spot is valid and currently empty
               if (targetSpot !== -1 && targetSpot < farmCapacity && !currentCrops[targetSpot]) {
                    const newCrop = {
                       id: `crop_${Date.now()}_${targetSpot}`,
                       type: cropType,
                       startTime: Date.now(),
                       spotIndex: targetSpot,
                       currentStage: 0, // Initialize current stage of crop ex if its a seed or plant
                       stageStartTime: null, // State how long the crop has been its stage ex how long its been a seed or plant
                   };
                   success = true;
                   // Create a copy of the crops array, ensuring it has the correct length
                   const updatedCrops = [...currentCrops];
                   while (updatedCrops.length < farmCapacity) updatedCrops.push(null);
                   updatedCrops[targetSpot] = newCrop; // Place the new crop
                   return { ...plot, crops: updatedCrops };
               } else {
                   console.warn(`Farm plot ${plotId} spot ${targetSpot} is full or invalid!`);
               }
           }
           return plot; // Return unchanged plot if not a farm or if planting failed
       });

        // If planting was successful, remove one seed from inventory
        if (success) {
            updateInventory(seedId, -1);
        }
        return success;
    }, [inventory, updateInventory, updatePlot]); // Depends on inventory

   // Harvest a fully grown crop from a specific spot
   const harvestCrop = useCallback((plotId, cropId) => {
       let harvestedItem = null;
       let yieldAmount = 0;

       updatePlot(plotId, (plot) => {
           if (plot.type === 'farm' && plot.crops) {
               // Find the crop by its unique ID
               const cropIndex = plot.crops.findIndex(c => c && c.id === cropId);
               if (cropIndex > -1) {
                   const crop = plot.crops[cropIndex];
                   const cropInfo = staticCropTypes[crop.type];
                   if (!cropInfo) return plot; // Safety check for valid crop type

                   // Check if the crop is actually grown
                   const totalStages = cropInfo.stages ?? 5;
                   const timeElapsed = Date.now() - crop.startTime;
                   const growthTimePerStage = cropInfo.growthTimePerStage ?? 6000;
                   const currentStage = Math.min(totalStages, Math.floor(timeElapsed / growthTimePerStage) + 1);

                   if (currentStage >= totalStages) {
                       // Crop is ready! Determine what and how much is harvested
                       harvestedItem = crop.type;
                       yieldAmount = cropInfo.harvestYield ?? 1;
                       // Clear the spot by setting it to null
                       const updatedCrops = [...plot.crops];
                       updatedCrops[cropIndex] = null;
                       return { ...plot, crops: updatedCrops };
                   } else {
                       // Crop wasn't ready, log a warning
                       console.warn(`Crop ${cropId} not fully grown!`);
                   }
               }
           }
           return plot; // Return unchanged plot if conditions aren't met
       });

       // If harvesting was successful, add the item(s) to inventory
       if (harvestedItem && yieldAmount > 0) {
           updateInventory(harvestedItem, yieldAmount);
       }
   }, [updateInventory, updatePlot]); // Doesn't depend on external state besides static data

   //Main function for watering a crop - logic differnt for critter due to multiple staghes

    const waterCrop = useCallback((plotId, cropId) => {
        updatePlot(plotId, (currentPlot) => {
            if (currentPlot.type !== 'farm' || !currentPlot.crops) return currentPlot;
            const cropIndex = currentPlot.crops.findIndex(c => c && c.id === cropId);
            if (cropIndex === -1) return currentPlot;

            const crop = currentPlot.crops[cropIndex];
            const cropInfo = staticCropTypes[crop.type];
            if (!cropInfo) return currentPlot;

            const totalStages = cropInfo.stages ?? 5;

            // water after planting seed
            if (crop.stageStartTime === null && crop.currentStage < totalStages - 1) {
                const updatedCrops = [...currentPlot.crops];
                updatedCrops[cropIndex] = {
                    ...crop,
                    stageStartTime: Date.now() // start time for plant in this stage
                };

                return { ...currentPlot, crops: updatedCrops };
            }
            return currentPlot; 
        });
    }, [updatePlot ]); 

    // puts crop to next stage if watered then we have to water again to go to next stage and so on until we can harvest
    const advanceCropStage = useCallback((plotId, cropId) => {
        updatePlot(plotId, (currentPlot) => {
            if (currentPlot.type !== 'farm' || !currentPlot.crops) return currentPlot;
            const cropIndex = currentPlot.crops.findIndex(c => c && c.id === cropId);
            if (cropIndex === -1) return currentPlot;

            const crop = currentPlot.crops[cropIndex];
            const cropInfo = staticCropTypes[crop.type];
            if (!cropInfo) return currentPlot;

            const totalStages = cropInfo.stages ?? 5;

            // puts crop to next stage
            if (crop.stageStartTime !== null && crop.currentStage < totalStages - 1) {
                const updatedCrops = [...currentPlot.crops];
                updatedCrops[cropIndex] = {
                    ...crop,
                    currentStage: crop.currentStage + 1, // next stage
                    stageStartTime: null // re water plant
                };
                return { ...currentPlot, crops: updatedCrops }; //returns next srage
            }
            return currentPlot; 
        });
    }, [updatePlot]);



   // Add a new critter to a pen, checking capacity and egg availability
   const addCritter = useCallback((plotId, critterTypeId) => {
       const critterInfo = staticCritterTypes[critterTypeId];
       if (!critterInfo) {
            console.warn(`Unknown critter type: ${critterTypeId}`);
            return false;
        }

       // Check for the required egg
       const eggId = critterInfo.eggId;
       if (!eggId || (inventory[eggId] || 0) < 1) {
           console.warn(`Not enough ${eggId || 'eggs'}!`);
           return false;
       }

       let success = false;
       // Use the base capacity defined in gameData
       const penCapacity = critterInfo.penCapacity ?? 3;

        updatePlot(plotId, (plot) => {
           if (plot.type === 'pen') {
               const currentCritterCount = (plot.critters || []).length;
                // Check if there's space in the pen
                if (currentCritterCount < penCapacity) {
                    // Create the new critter data
                    const newCritter = {
                        id: `critter_${Date.now()}`,
                        type: critterTypeId,
                        lastResourceDrop: Date.now(), // Start timer immediately
                    };
                    success = true;
                    return { ...plot, critters: [...(plot.critters || []), newCritter] };
                } else {
                     console.warn(`Pen ${plotId} is full!`);
                }
           } else {
                console.warn("Can only add critters to a Pen.");
           }
           return plot;
       });

       // If successful, consume one egg
       if (success) {
           updateInventory(eggId, -1);
       }
       return success;
   }, [inventory, updateInventory, updatePlot]); // Depends on inventory


    // Buy an item (seed, egg) from the shop
    const buyShopItem = useCallback((itemId) => {
        const item = staticItemDetails[itemId];
        if (!item || !item.buyPrice) {
            console.warn(`Item ${itemId} not available for purchase.`);
            return;
        }
        // Check if player has enough coins
        if (coins >= item.buyPrice) {
            updateCoins(-item.buyPrice);
            updateInventory(itemId, 1);
        } else {
            console.warn("Not enough coins.");
        }
    }, [coins, updateCoins, updateInventory]); // Depends on coins

    // Sell a specified quantity of an item from the inventory
    const sellInventoryItem = useCallback((itemId, quantity) => {
        const item = staticItemDetails[itemId];
        const currentQuantity = inventory[itemId] || 0;

        // Check if item exists, is sellable, and player has enough
        if (!item || !item.sellPrice) {
            console.warn(`Item ${itemId} cannot be sold.`);
            return;
        }
        if (currentQuantity < quantity) {
            console.warn(`Not enough ${itemId} to sell.`);
            return;
        }

        const coinsEarned = item.sellPrice * quantity;
        updateInventory(itemId, -quantity);
        updateCoins(coinsEarned);

    }, [inventory, updateInventory, updateCoins]); // Depends on inventory and coins

    // Convert an empty plot to either a farm or a pen
    const convertPlot = useCallback((plotId, newType) => {
       // Find the plot first to ensure it's empty (avoids race conditions)
       const plotToConvert = plots.find(p => p.id === plotId);
        if (!plotToConvert || plotToConvert.type !== 'empty') {
            console.warn("Can only convert empty plots.");
            return;
        }


       // Determine the cost based on the target type
       const cost = newType === 'farm' ? plotCosts.upgradeToFarm : plotCosts.upgradeToPen;
       if (coins < cost) {
           console.warn(`Not enough coins to make a ${newType}.`);
           return;
       }

       // Deduct cost first
       updateCoins(-cost);

       // Then update the plot state
        updatePlot(plotId, (plot) => {
            // Double check type just in case
            if (plot.type === 'empty') {
                if (newType === 'farm') {
                    // Initialize farm with empty crop array
                    return { ...plot, type: 'farm', crops: [] };
                } else if (newType === 'pen') {
                    // Initialize pen with empty critter and resource arrays
                    return { ...plot, type: 'pen', critters: [], resources: [] };
                }
            }
            return plot; // Should not happen, return unchanged
        });

    }, [coins, updateCoins, updatePlot, plotCosts, plots]); // Depends on coins and plotCosts

    const saveAllGameState = useCallback(() => {
        if (!playerId) return;
        // Save inventory and plots at once
        const inventoryArray = Object.entries(inventory).map(([ItemName, Quantity]) => ({
            ItemName,
            Quantity,
        }));
        saveInventory(playerId, inventoryArray);
        savePlots(playerId, plots);
    }, [playerId, inventory, plots]);
    

    // --- Provide State and Actions to Consuming Components --- //
    const value = {
        // State
        plots,
        inventory,
        coins,
        hasLoadedInventory,
        // Static Data (could also be imported directly)
        itemDetails: staticItemDetails,
        critterTypes: staticCritterTypes,
        cropTypes: staticCropTypes,
        plotCosts: staticPlotCosts,
        // Actions
        updateCoins,
        updateInventory,
        updatePlot,
        addPlot,
        plantCrop,
        harvestCrop,
        addCritter,
        addResourceDropToPlot,
        removeResourceDropFromPlot,
        buyShopItem,
        sellInventoryItem,
        convertPlot,
        saveAllGameState,
        waterCrop,
        advanceCropStage,
        selectedResource,
        setSelectedResource,
        cursorPosition,
        setCursorPosition
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}; 