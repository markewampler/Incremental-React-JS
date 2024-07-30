export const player = {
    name: 'PlayerName',
    age: 8,
    location: 'Rural', // This will be set by the roll
    wealth: 0,
    dp: 0,
    className: 'Peasant',
    attributes: {
        STR: { value: 10 },
        DEX: { value: 10 },
        STA: { value: 10 },
        INT: { value: 10 },
        WIS: { value: 10 },
        CHA: { value: 10 }
    },
    initialAttributes: {
        STR: { value: 10 },
        DEX: { value: 10 },
        STA: { value: 10 },
        INT: { value: 10 },
        WIS: { value: 10 },
        CHA: { value: 10 }
    },
    maxAge: 15, // This will be calculated
    startingLocationWeight: {
        Rural: 90,
        Village: 10,
        Town: 1,
        City: 1,
        MageTower: 1,
        Castle: 1,
        Capital: 1,
        Forest: 5
    },
    skills: [
        // Skills for Peasant
        {
          name: 'Farming',
          effects: { STR: 2, DEX: 1, STA: 1 },
          multipliers: { STR: 1, DEX: 0.5 },
          learningTime: 500,
          learned: 0,
          classDependency: ['Peasant'],
          attributeDependency: { STR: 5 },
          locationDependency: ['Rural', 'Village'],
          moneyEarned: 10,
        },
        {
          name: 'Animal Husbandry',
          effects: { STR: 1, INT: 1, WIS: 1 },
          multipliers: { INT: 1 },
          learningTime: 1000,
          learned: 0,
          classDependency: ['Peasant'],
          attributeDependency: { INT: 5 },
          locationDependency: ['Rural', 'Village'],
          moneyEarned: 15,
        },
        {
          name: 'Hunting',
          effects: { STA: 1, WIS: 2 },
          multipliers: { DEX: 0.5, WIS: 0.5 },
          learningTime: 200,
          learned: 0,
          classDependency: ['Peasant', 'Hunter'],
          attributeDependency: { DEX: 5 },
          locationDependency: ['Rural', 'Village', 'Forest'],
          moneyEarned: 20,
        },
        {
            name: 'Street Sweeping',
            effects: { STR: 1, STA: 1 },
            multipliers: { STR: 1 },
            learningTime: 1000,
            learned: 0,
            classDependency: ['Peasant'],
            attributeDependency: { STR: 5 },
            locationDependency: ['City'],
            moneyEarned: 15,
          },
    
        // Skills for Mage
        {
          name: 'Spell Casting',
          effects: { INT: 2, WIS: 1 },
          multipliers: { INT: 1 },
          learningTime: 800,
          learned: 0,
          classDependency: ['Mage', 'Battle Mage'],
          attributeDependency: { INT: 7 },
          locationDependency: ['Mage Tower', 'City'],
          moneyEarned: 30,
        },
        {
          name: 'Arcane Knowledge',
          effects: { INT: 2, CHA: 1 },
          multipliers: { INT: 0.5, CHA: 1 },
          learningTime: 1200,
          learned: 0,
          classDependency: ['Mage', 'Battle Mage'],
          attributeDependency: { INT: 8, CHA: 4 },
          locationDependency: ['Mage Tower', 'City'],
          moneyEarned: 25,
        },
    
        // Skills for Knight
        {
          name: 'Swordsmanship',
          effects: { STR: 2, DEX: 1, STA: 1 },
          multipliers: { STR: 1, DEX: 0.5 },
          learningTime: 600,
          learned: 0,
          classDependency: ['Knight', 'Squire'],
          attributeDependency: { STR: 6 },
          locationDependency: ['Castle', 'Capital'],
          moneyEarned: 35,
        },
        {
          name: 'Chivalry',
          effects: { STR: 1, CHA: 2 },
          multipliers: { CHA: 1 },
          learningTime: 1000,
          learned: 0,
          classDependency: ['Knight', 'Squire'],
          attributeDependency: { CHA: 6 },
          locationDependency: ['Castle', 'Capital'],
          moneyEarned: 30,
        },
      ]
  };


export const locations = {
    Rural: {
        cost: 10, // Example cost
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 5
    },
    Village: {
        cost: 20, // Example cost
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 10
    },
    Town: {
        cost: 30, // Example cost
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 15
    },
    City: {
        cost: 40, // Example cost
        requiresClassDependency: true,
        classDependencies: ['Mage', 'Merchant'],
        maxAgeBonus: 20
    },
    MageTower: {
        cost: 50, // Example cost
        requiresClassDependency: true,
        classDependencies: ['Mage', 'Battle Mage'],
        maxAgeBonus: 25
    },
    Castle: {
        cost: 60, // Example cost
        requiresClassDependency: true,
        classDependencies: ['Page', 'Squire', 'Knight', 'Nobility', 'Royalty'],
        maxAgeBonus: 30
    },
    Capital: {
        cost: 70, // Example cost
        requiresClassDependency: true,
        classDependencies: ['Page', 'Squire', 'Knight', 'Battle Mage', 'Nobility', 'Royalty'],
        maxAgeBonus: 35
    },
    Forest: {
        cost: 15, // Example cost
        requiresClassDependency: false,
        classDependencies: [],
        maxAgeBonus: 10
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
  
  export function calculateMaxAge(attributes, location) {
    const { INT, STA, WIS } = attributes;
    const locationBonus = locations[location].maxAgeBonus;
    const baseMaxAge = 15; // Base maximum age
    return baseMaxAge + INT.value + STA.value + WIS.value + locationBonus;
  }