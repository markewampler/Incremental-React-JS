import { classes } from '../data/playerData';

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

export function calculateLearningSpeed(player, skill) {
  if (!player?.attributes || !skill?.multipliers) return 1;

  let speed = 1;
  for (const [attr, multiplier] of Object.entries(skill.multipliers)) {
    const attribute = player.attributes[attr];
    if (attribute) {
      speed += attribute.value * multiplier;
    }
  }
  return speed;
}
export function filterSkillsByClassAndAttributes(player) {
  return player.skills.filter(skill => {
    const meetsClassDependency = skill.classDependency.includes(player.className);
    const meetsAttributeDependency = Object.entries(skill.attributeDependency).every(
      ([attr, value]) => player.attributes[attr].value >= value
    );
    const meetsLocationDependency = skill.locationDependency.includes(player.location);
    return meetsClassDependency && meetsAttributeDependency && meetsLocationDependency;
  });
}

// Check if the player meets both location and attribute dependencies for a class
export function filterClassesByLocationAndAttributes(player) {
  return classes.filter(cls => {
    const meetsLocationDependency = cls.locationDependency.includes(player.location);

    // Ensure attributeDependencies exists and is an array before using it
    const meetsAttributeDependency = cls.attributeDependencies
      ? cls.attributeDependencies.every(dep =>
          player.attributes[dep.attribute]?.value >= dep.value
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
  const meetsLocationDependency = classData.locationDependency.includes(player.location);

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

export const formatWealth = (totalCoins) => {
  return `${totalCoins} coins`;
};

