// src/config/gameData.js
// --- Item Definitions ---
export const itemDetails = {
    // Resources
    'slime_resource': { name: 'Slime Goo', sellPrice: 5, icon: '/assets/ItemSprites/SlimeBall.png' }, // Updated Icon
    'lettuce': { name: 'Lettuce', sellPrice: 15, icon: '/assets/Plants/Lettuce/LettuceHarvested.png' }, // Updated Icon
    'cat_trinket': { name: 'Cat Trinket', sellPrice: 25, icon: '/assets/ItemSprites/TinyBell.png' }, // Updated Icon
    'void_fragment': { name: 'Void Fragment', sellPrice: 50, icon: '/assets/ItemSprites/VoidCrystal.png' }, // Updated Icon
    'carrot': { name: 'Carrot', sellPrice: 25, icon: '/assets/Plants/Carrot/CarrotHarvested.png' }, // New Carrot Item
    'berry': { name: 'Berry', sellPrice: 35, icon: '/assets/Plants/Berry/BerryHarvested.png' }, // New Berry Item

    // Seeds
    'lettuce_seed': { name: 'Lettuce Seed', buyPrice: 10, icon: '/assets/Plants/Lettuce/lettuceSeed.png', category: 'seeds' }, // Updated Icon
    'carrot_seed': { name: 'Carrot Seed', buyPrice: 15, icon: '/assets/Plants/Carrot/carrotSeed.png', category: 'seeds' }, // New Carrot Seed
    'berry_seed': { name: 'Berry Seed', buyPrice: 20, icon: '/assets/Plants/Berry/berrySeed.png', category: 'seeds' }, // New Berry Seed

    // Eggs
    'slime_egg': { name: 'Slime Egg', buyPrice: 50, icon: '/assets/ItemSprites/SlimeEgg.png', category: 'eggs' }, // Updated Icon
    'cat_egg': { name: 'Cat Egg', buyPrice: 150, icon: '/assets/ItemSprites/CatEgg.png', category: 'eggs' }, // Updated Icon
    'void_egg': { name: 'Void Egg', buyPrice: 300, icon: '/assets/ItemSprites/VoidEgg.png', category: 'eggs' }, // Updated Icon

};

// --- Critter Definitions ---
export const critterTypes = {
    'slime': {
        name: 'Slime',
        asset: '/assets/Critters/SlimeCritter/slimeIdle.gif',
        produces: 'slime_resource',
        productionTime: 30000, // 30 seconds
        penCapacity: 3,
        eggId: 'slime_egg'
    },
    'cat': {
        name: 'Cat',
        asset: '/assets/Critters/CatCritter/CatIdleRight.gif',
        produces: 'cat_trinket',
        productionTime: 60000, // 60 seconds (example)
        penCapacity: 2, // Example capacity
        eggId: 'cat_egg'
    },
    'void': {
        name: 'Void',
        asset: '/assets/Critters/VoidCritter/voidIdle.gif',
        produces: 'void_fragment',
        productionTime: 120000, // 120 seconds (example)
        penCapacity: 1, // Example capacity
        eggId: 'void_egg'
    },
};

// --- Crop Definitions ---
export const cropTypes = {
    'lettuce': {
        name: 'Lettuce',
        growthTimePerStage: 6000, // 6 seconds per stage
        stages: 5, // 5 stages * 6 seconds = 30 seconds total growth time
        seedId: 'lettuce_seed',
        growingAssets: [
            '/assets/Plants/Lettuce/frame_0_delay-0.5s.gif', // Stage 1
            '/assets/Plants/Lettuce/frame_1_delay-0.5s.gif', // Stage 2
            '/assets/Plants/Lettuce/frame_2_delay-0.5s.gif', // Stage 3
            '/assets/Plants/Lettuce/frame_3_delay-0.5s.gif', // Stage 4
            '/assets/Plants/Lettuce/frame_4_delay-0.5s.gif', // Stage 5 (last growing frame before final)
        ],
        grownAsset: '/assets/Plants/Lettuce/lettuceGrown.gif', // Shown at stage 5
        harvestYield: 1,
    },
    'carrot': {
        name: 'Carrot',
        growthTimePerStage: 7000, // 7 seconds per stage
        stages: 5, // 5 stages * 7 seconds = 35 seconds total growth time
        seedId: 'carrot_seed',
        growingAssets: [
            '/assets/Plants/Carrot/frame_0_delay-0.4s.gif',
            '/assets/Plants/Carrot/frame_1_delay-0.4s.gif',
            '/assets/Plants/Carrot/frame_2_delay-0.4s.gif',
            '/assets/Plants/Carrot/frame_3_delay-0.4s.gif',
            '/assets/Plants/Carrot/frame_4_delay-0.4s.gif',
        ],
        grownAsset: '/assets/Plants/Carrot/carrotGrownIDle.gif',
        harvestYield: 1,
    },
    'berry': {
        name: 'Berry',
        growthTimePerStage: 8000, // 8 seconds per stage
        stages: 5, // 5 stages * 8 seconds = 40 seconds total growth time
        seedId: 'berry_seed',
        growingAssets: [
            '/assets/Plants/Berry/frame_0_delay-0.4s.gif',
            '/assets/Plants/Berry/frame_1_delay-0.4s.gif',
            '/assets/Plants/Berry/frame_2_delay-0.4s.gif',
            '/assets/Plants/Berry/frame_3_delay-0.4s.gif',
            '/assets/Plants/Berry/frame_4_delay-0.4s.gif',
        ],
        grownAsset: '/assets/Plants/Berry/berryGrownIdle.gif',
        harvestYield: 2, // Example: Berries yield more
    }
    // Add more crop types...
};

// --- Plot Costs ---
export const plotCosts = {
    buyPlot: 200,
    upgradeToFarm: 0, // Free for now
    upgradeToPen: 0,  // Free for now
};

// --- Initial Game State ---
export const initialPlots = [
    { id: 1, type: 'pen', critters: [{ id: 's1', type: 'slime', lastResourceDrop: Date.now() }], resources: [] },
    { id: 2, type: 'farm', crops: [] }, // Keep farm capacity at 2
    { id: 3, type: 'empty' },
    { id: 4, type: 'empty' },
];

export const initialInventory = {
    'lettuce_seed': 5,
    'carrot_seed': 3, // Give some initial carrot seeds
    'berry_seed': 2, // Give some initial berry seeds
};

export const initialCoins = 100;

// --- Upgrade Definitions (REMOVED) ---
// export const upgradeDetails = { ... };

// --- Initial Upgrades State (REMOVED) ---
// export const initialUpgrades = new Set();

// +++ Add initial purchased upgrades state +++
export const initialUpgrades = new Set(); // Start with no upgrades purchased 