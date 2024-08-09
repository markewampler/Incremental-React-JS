const MAX_AGE_STA_DIVISOR = 10;
const MAX_AGE_WIS_DIVISOR = 10;
const MAX_AGE = 30;

export const player = {
  name: 'PlayerName',
  age: 8,
  location: 'Forest',
  defaultLocation: 'Forest',
  wealth: 0,
  dp: 0,
  className: 'Peasant',
  attributes: {
    STR: { value: 10, increasedValue: 0 },
    DEX: { value: 10, increasedValue: 0 },
    STA: { value: 10, increasedValue: 0 },
    INT: { value: 10, increasedValue: 0 },
    WIS: { value: 10, increasedValue: 0 },
    CHA: { value: 10, increasedValue: 0 }
  },
  maxAge: 15, // This will be calculated
  learnedSkills: [],
  purchasedItems: [],
  purchasedLocations: []
};

  export const calculateMaxAge = (attributes) => {
    let maxAge = MAX_AGE;
    maxAge += Math.floor((attributes.STA.value + attributes.STA.increasedValue) / MAX_AGE_STA_DIVISOR);
    maxAge += Math.floor((attributes.WIS.value + attributes.WIS.increasedValue) / MAX_AGE_WIS_DIVISOR);
    return maxAge;
  };