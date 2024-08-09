export const skills = [
    // Skills for Peasant
    {
    id: 1,
    name: 'Farming',
    effects: { STR: 2, DEX: 1, STA: 1 },
    multipliers: { STR: 1, DEX: 0.5 },
    learningTime: 500,
    classDependency: ['Peasant'],
    attributeDependency: { STR: 5 },
    locationDependency: ['Forest','Rural', 'Village'],
    moneyEarned: 10,
    itemDependency: 'Farming Implements'
    },
    {
    id: 2,
    name: 'Animal Husbandry',
    effects: { STR: 1, INT: 1, WIS: 1 },
    multipliers: { INT: 1 },
    learningTime: 1000,
    classDependency: ['Peasant'],
    attributeDependency: { INT: 5 },
    locationDependency: ['Rural', 'Village'],
    moneyEarned: 15,
    itemDependency: null
    },
    {
    id: 3,
    name: 'Hunting',
    effects: { STA: 1, WIS: 2 },
    multipliers: { DEX: 0.5, WIS: 0.5 },
    learningTime: 200,
    classDependency: ['Peasant', 'Hunter'],
    attributeDependency: { DEX: 5 },
    locationDependency: ['Rural', 'Village', 'Forest'],
    moneyEarned: 20,
    itemDependency: null
    },
    {
    id: 4,
    name: 'Construction',
    effects: { STA: 1, WIS: 2 },
    multipliers: { DEX: 0.5, WIS: 0.5 },
    learningTime: 200,
    classDependency: ['Peasant'],
    attributeDependency: { DEX: 5 },
    locationDependency: ['Rural', 'Village', 'Forest'],
    moneyEarned: 20,
    itemDependency: 'Farming Tools'
    },
    {
    id: 5,
    name: 'Street Sweeping',
    effects: { STR: 1, STA: 1 },
    multipliers: { STR: 1 },
    learningTime: 1000,
    classDependency: ['Peasant'],
    attributeDependency: { STR: 5 },
    locationDependency: ['City'],
    moneyEarned: 15,
    itemDependency: null
    },

    // Skills for Mage
    {
    id: 6,
    name: 'Spell Casting',
    effects: { INT: 2, WIS: 1 },
    multipliers: { INT: 1 },
    learningTime: 800,
    classDependency: ['Mage', 'Battle Mage'],
    attributeDependency: { INT: 7 },
    locationDependency: ['Mage Tower', 'City'],
    moneyEarned: 30,
    itemDependency: null
    },
    {
    id: 7,
    name: 'Arcane Knowledge',
    effects: { INT: 2, CHA: 1 },
    multipliers: { INT: 0.5, CHA: 1 },
    learningTime: 1200,
    classDependency: ['Mage', 'Battle Mage'],
    attributeDependency: { INT: 8, CHA: 4 },
    locationDependency: ['Mage Tower', 'City'],
    moneyEarned: 25,
    itemDependency: null
    },

    // Skills for Knight
    {
    id: 8,
    name: 'Swordsmanship',
    effects: { STR: 2, DEX: 1, STA: 1 },
    multipliers: { STR: 1, DEX: 0.5 },
    learningTime: 600,
    classDependency: ['Knight', 'Squire'],
    attributeDependency: { STR: 6 },
    locationDependency: ['Castle', 'Capital'],
    moneyEarned: 35,
    itemDependency: null
    },
    {
    id: 9,
    name: 'Chivalry',
    effects: { STR: 1, CHA: 2 },
    multipliers: { CHA: 1 },
    learningTime: 1000,
    classDependency: ['Knight', 'Squire'],
    attributeDependency: { CHA: 6 },
    locationDependency: ['Castle', 'Capital'],
    moneyEarned: 30,
    itemDependency: null
    },
    {
    id: 10,
    name: 'Mushrooming',
    effects: { STA: 1 },
    multipliers: { DEX: 0.5, WIS: 0.5 },
    learningTime: 200,
    classDependency: ['Peasant'],
    attributeDependency: { DEX: 5 },
    locationDependency: ['Rural', 'Village', 'Forest'],
    moneyEarned: 1,
    itemDependency: ''
    }
        
];


export const locations = {
    Rural: {
        cost: 10, 
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 5,
        divinePointCost: 0,
    },
    Village: {
        cost: 20, 
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 10,
        divinePointCost: 5,
    },
    Town: {
        cost: 30, 
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 15,
        divinePointCost: 10,
    },
    City: {
        cost: 40, 
        requiresClassDependency: true,
        classDependencies: ['Mage', 'Merchant'],
        maxAgeBonus: 20,
        divinePointCost: 15,
    },
    MageTower: {
        cost: 50, 
        requiresClassDependency: true,
        classDependencies: ['Mage', 'Battle Mage'],
        maxAgeBonus: 25,
        divinePointCost: 30,
},
    Castle: {
        cost: 60, 
        requiresClassDependency: true,
        classDependencies: ['Page', 'Squire', 'Knight', 'Nobility', 'Royalty'],
        maxAgeBonus: 30,
        divinePointCost: 50,
    },
    Capital: {
        cost: 70, 
        requiresClassDependency: true,
        classDependencies: ['Page', 'Squire', 'Knight', 'Battle Mage', 'Nobility', 'Royalty'],
        maxAgeBonus: 35,
        divinePointCost: 100,
    },
    Forest: {
        cost: 0, 
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 10,
        divinePointCost: 5,
    }
};


export const classes = [
    { 
    name: 'Peasant', 
    locationDependency: ['Rural', 'Village'], 
    attributeDependencies: [] 
    },
    { 
    name: 'Page', 
    locationDependency: ['Rural','Castle', 'Capital'], 
    attributeDependencies: [
        {attribute: 'STR', value: 15 }
    ] 
    },
    { 
    name: 'Squire', 
    locationDependency: ['Castle', 'Capital'], 
    attributeDependencies: [] 
    },
    { 
    name: 'Knight', 
    locationDependency: ['Castle', 'Capital'], 
    attributeDependencies: [
        { attribute: 'STR', value: 50 }
    ] 
    },
    { 
    name: 'Mage', 
    locationDependency: ['Mage Tower', 'City'], 
    attributeDependencies: [
        { attribute: 'INT', value: 100 },
        { attribute: 'WIS', value: 50 }
    ] 
    },
    { 
    name: 'Battle Mage', 
    locationDependency: ['Mage Tower', 'Capital'], 
    attributeDependencies: [
        { attribute: 'INT', value: 120 },
        { attribute: 'WIS', value: 70 }
    ] 
    },
    { 
    name: 'Merchant', 
    locationDependency: ['Village', 'Town', 'City'], 
    attributeDependencies: [] 
    },
    { 
    name: 'Nobility', 
    locationDependency: ['Capital', 'Castle'], 
    attributeDependencies: [
        { attribute: 'CHA', value: 80 }
    ] 
    },
    { 
    name: 'Royalty', 
    locationDependency: ['Capital', 'Castle'], 
    attributeDependencies: [
        { attribute: 'CHA', value: 100 }
    ] 
    }
];

export const items = [
    { name: 'Farming Implements', 
    cost: 10, 
    divinePointCost: 5,
    locationDependency: ['Forest','Rural','Village']
    },
    { name: 'Construction Tools', 
    cost: 20,
    divinePointCost: 10,
    locationDependency: ['Forest','Rural','Village']
    },
    { name: 'Old Book', 
        cost: 50,
        divinePointCost: 100,
        locationDependency: ['MageTower']
    },
];


