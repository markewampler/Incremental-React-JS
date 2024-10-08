import { player } from '../data/playerData';
import { skills  as allSkills, items, classes } from '../data/gameData';

const LEARNING_CAP_PERCENTAGE = 0.10;
const DIVINE_POINT_DIVISOR = 10;
const LEARNING_SPEED_DIVISOR =1;

export function getAttributes(player) {
  if (!player?.attributes) return [];

  return Object.keys(player.attributes).map(key => ({
    name: key, // Use the key as the name
    value: player.attributes[key]?.value ?? 0
  }));
}

export function increaseAttribute(player, name, amount) {
  if (!player?.attributes) return;

  if (player.attributes[name]) {
    player.attributes[name].value += amount;
  }
}

export const calculateLearningSpeed = (playerState, skill) => {
  const baseLearningSpeed = calculateBaseLearningSpeed(playerState, skill);
  const cap = skill.learningTime * LEARNING_CAP_PERCENTAGE;
  return Math.min(baseLearningSpeed, cap);
  
};

export function calculateBaseLearningSpeed(player, skill) {
  if (!player?.attributes || !skill?.multipliers) return 1;

  let speed = 1;
  for (const [attr, multiplier] of Object.entries(skill.multipliers)) {
    const attribute = player.attributes[attr];
    if (attribute) {
      speed += (attribute.value + attribute.increasedValue) * multiplier / LEARNING_SPEED_DIVISOR;
    }
  }
  return speed;
}


export function filterSkillsByClassAndAttributes(player) {
  return allSkills
    .filter(skill => skill.classDependency.includes(player.className))
    .map(skill => {
      const meetsAttributeDependency = Object.entries(skill.attributeDependency).every(
        ([attr, value]) => (player.attributes[attr].value + player.attributes[attr].increasedValue) >= value
      );
      const meetsLocationDependency = skill.locationDependency.length === 0 || skill.locationDependency.includes(player.location);
      const meetsItemDependency = !skill.itemDependency || player.purchasedItems.some(item => item.name === skill.itemDependency && (item.coinPurchased || item.divinePointPurchase));

      return {
        ...skill,
        isAvailable: meetsAttributeDependency && meetsLocationDependency && meetsItemDependency,
        unmetDependencies: {
          attribute: !meetsAttributeDependency,
          location: !meetsLocationDependency,
          item: !meetsItemDependency,
        }
      };
    });
}

// Check if the player meets both location and attribute dependencies for a class
export function filterClassesByLocationAndAttributes(player) {
  return classes.filter(cls => {
    const meetsLocationDependency = cls.locationDependency.length === 0 || cls.locationDependency.includes(player.location);

    // Ensure attributeDependencies exists and is an array before using it
    const meetsAttributeDependency = cls.attributeDependencies
      ? cls.attributeDependencies.every(dep =>
          (player.attributes[dep.attribute]?.value + player.attributes[dep.attribute]?.increasedValue) >= dep.value
        )
      : true; // If no attributeDependencies, assume the player meets this requirement

    return meetsLocationDependency && meetsAttributeDependency;
  });
}

// Check if the player meets both location and attribute dependencies for a class
export function canClassBeSelected(player, selectedClass) {
  const classData = classes.find(c => c.name === selectedClass);

  if (!classData) return false;

  // Check location dependency
  const meetsLocationDependency = classData.locationDependency.length === 0 || classData.locationDependency.includes(player.location);
  console.log(meetsLocationDependency + ' ' + classData.name)
  // Check attribute dependencies
  const meetsAttributeDependency = classData.attributeDependencies.every(dep =>
    player.attributes[dep.attribute]?.value >= dep.value
  );

  return meetsLocationDependency && meetsAttributeDependency;
}

export const addWealth = (currentWealth, earnedAmount) => {
  return currentWealth + earnedAmount;
};

export const deductWealth = (currentWealth, deductionAmount) => {
  return currentWealth - deductionAmount;
};

export const calculateDivinePoints = (attributes) => {
  let points = 0;
  for (const key in attributes) {
    if (attributes[key].increasedValue) {
      points += attributes[key].increasedValue;
      
    }
  }
  points = Math.floor(points / DIVINE_POINT_DIVISOR);
  return points > 0 ? points : 0;
};

export const loadPlayerState = () => {
  const savedState = localStorage.getItem('playerState');
  return savedState ? JSON.parse(savedState) : null;
};

export const savePlayerState = (playerState) => {
  localStorage.setItem('playerState', JSON.stringify(playerState));
};