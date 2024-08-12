import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AttributeCard from './components/AttributeCard';
import PlayerInfo from './components/PlayerInfo';
import SkillList from './components/SkillList';
import { player, calculateMaxAge } from './data/playerData';
import { locations, items, skills as allSkills, classes } from './data/gameData';
import { 
  calculateLearningSpeed, 
  filterSkillsByClassAndAttributes, 
  filterClassesByLocationAndAttributes, 
  addWealth,
  calculateDivinePoints,
  loadPlayerState,
  savePlayerState
} from './utils/utils';
import LocationChangeModal from './components/LocationChangeModal';
import PurchaseItemsModal from './components/PurchaseItemsModal';
import ClassChangeModal from './components/ClassChangeModal';
import MaxAgeModal from './components/MaxAgeModal';

const AGE_INCREMENT = 1
const TIME_INCREMENT = 1000

function App() {

  const intervalRef = useRef(null);

  const initialPlayerState = loadPlayerState() || {
    ...player,
    location: 'Forest',
    purchasedLocations: player.purchasedLocations || ["Forest"]
  };
  const [playerState, setPlayerState] = useState({
    ...initialPlayerState,
    attributes: { ...initialPlayerState.attributes },
    wealth: initialPlayerState.wealth,
    location: initialPlayerState.location || 'Forest',
    purchasedLocations: initialPlayerState.purchasedLocations || ["Forest"]
  });

  useEffect(() => {
    savePlayerState(playerState); 
  }, [playerState]);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [highlightedAttributes, setHighlightedAttributes] = useState([]);
  const [highlightedDivinePoints, setHighlightedDivinePoints] = useState(false);
  const [ageInterval, setAgeInterval] = useState(1000); // 1 second per age increase
  const [availableClasses, setAvailableClasses] = useState(filterClassesByLocationAndAttributes(player));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isClassChangeModalOpen, setIsClassChangeModalOpen] = useState(false);
  const [isMaxAgeModalOpen, setIsMaxAgeModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  
  useEffect(() => {
    const newMaxAge = calculateMaxAge(playerState.attributes);
    setPlayerState(prevState => ({
      ...prevState,
      maxAge: newMaxAge,
    }));
  }, [playerState.attributes]);

  useEffect(() => {
    if (gameStarted && playerState.age >= playerState.maxAge) {
      // Update Divine Points to make sure credit is given
      const earnedDP = calculateDivinePoints(playerState.attributes);
      setPlayerState(prevState => ({
        ...prevState,
        dp: earnedDP
      }));  
      setIsMaxAgeModalOpen(true);
      setGamePaused(true); // Pause the game
    }
  }, [playerState.age, playerState.maxAge, gameStarted]);

  useEffect(() => {
    // Assume game starts when component mounts
    setGameStarted(true);
  }, []);
  
  useEffect(() => {

  
    if (!selectedSkill || gamePaused) {
      return; // Only run if selectedSkill is defined and game is not paused
    }
    
    clearInterval(intervalRef.current); // Clear any existing interval
  
    intervalRef.current = setInterval(() => {
  
      setPlayerState(prevState => {
  
        const newPlayerState = { ...prevState };
        let skill = newPlayerState.learnedSkills.find(s => s.id === selectedSkill.id);
  
        // Initialize skill if not found
        if (!skill) {
          skill = { id: selectedSkill.id, learned: 0 };
          newPlayerState.learnedSkills.push(skill);
        }
  
        const learningSpeed = calculateLearningSpeed(newPlayerState, selectedSkill);
  
        // Update age
        newPlayerState.age += AGE_INCREMENT; 
  
        // Update skill progress
        skill.learned = Math.min(skill.learned + learningSpeed, selectedSkill.learningTime);
  
        // Ensure learnedSkills array is updated
        newPlayerState.learnedSkills = newPlayerState.learnedSkills.map(s =>
          s.id === skill.id ? { ...skill } : s
        );
  
        savePlayerState(newPlayerState);
  
        let updatedSkill = newPlayerState.learnedSkills.find(s => s.id === selectedSkill.id);
  
        if (updatedSkill.learned >= selectedSkill.learningTime) {
          // Update attribute increases
          Object.entries(selectedSkill.effects).forEach(([attr, amount]) => {
            if (newPlayerState.attributes[attr]) {
              newPlayerState.attributes[attr].increasedValue += amount;
            }
          });
          
          // Highlight attributes
          setHighlightedAttributes(Object.keys(selectedSkill.effects));
  
          // Reset skill progress
          updatedSkill.learned = 0;
  
          // Update wealth and divine points together
          const updatedWealth = addWealth(newPlayerState.wealth, parseInt(selectedSkill.moneyEarned));
          const earnedDP = calculateDivinePoints(newPlayerState.attributes);
          
          if (earnedDP > newPlayerState.dp) {
            setHighlightedDivinePoints(true);
            } 

          newPlayerState.wealth = updatedWealth;
          newPlayerState.dp = earnedDP;
  
          savePlayerState(newPlayerState);
  
          setTimeout(() => {
            setHighlightedDivinePoints(false);
            setHighlightedAttributes([]);
          }, 3000); // Remove highlight after 3 seconds
  
          return newPlayerState;
        }
  
        return newPlayerState;
      });
    }, TIME_INCREMENT);
  
    return () => {
      clearInterval(intervalRef.current); // Clear the interval on cleanup
    };
  }, [selectedSkill, gamePaused]);

  useEffect(() => {
    if (highlightedAttributes.length > 0) {
      const timeoutId = setTimeout(() => {
        setHighlightedAttributes([]);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [highlightedAttributes]);

  // Calculate derived attributes
  const derivedAttributes = Object.keys(playerState.attributes).reduce((acc, key) => {
    acc[key] = playerState.attributes[key].value + (playerState.attributes[key].increasedValue || 0);
    return acc;
  }, {});


  const handleSoftReset = (newInitialAttributes, updatedItems, updatedLocations, selectedLocation) => {
    const newAttributes = { ...playerState.attributes };
      
    // Apply new initial values
    Object.entries(newInitialAttributes).forEach(([key, value]) => {
      newAttributes[key] = {
        value: value.value,
        increasedValue: 0,
      };
    });
  
    const purchasedItems = updatedItems
      ? updatedItems.filter(item => item.divinePointPurchase).map(item => ({ ...item, coinPurchased: false }))
      : [];
  
    const purchasedLocations = updatedLocations.length
      ? updatedLocations.map(locationKey => locationKey)
      : playerState.purchasedLocations;
  
    const newState = {
      ...playerState,
      attributes: newAttributes,
      age: 8,
      wealth: 0,
      dp: 0,
      className: 'Peasant',
      purchasedItems: purchasedItems,
      location: selectedLocation || 'Forest',
      defaultLocation: selectedLocation || 'Forest',
      learnedSkills: [],
      purchasedLocations: purchasedLocations // Ensure this is included in the new state
    };
  
    setPlayerState(newState);
    setSelectedSkill(null);
    savePlayerState(newState);
    setGamePaused(false);
  };



  const handleSelectSkill = (skill) => {
    setSelectedSkill(skill);
  };
  
  const handleClassChange = (newClassName, setPlayerState, setSelectedSkill) => {
    setPlayerState(prevState => ({ ...prevState, className: newClassName }));
    setSelectedSkill(null); // Clear the selected skill when the class changes
  };
  
  const handleLocationChange = (newLocation, updatedWealth) => {
    setPlayerState(prevState => ({
      ...prevState,
      location: newLocation,
      wealth: updatedWealth
    }));

    setAvailableClasses(filterClassesByLocationAndAttributes({ ...playerState, location: newLocation }));
    setSelectedSkill(null); // Clear the selected skill when the location changes
  };
  
  const handlePurchaseItem = (itemCost, itemName) => {
    setPlayerState(prevState => {
      
      // Check if the item is already in the purchasedItems array
      const existingItem = prevState.purchasedItems.find(item => item.name === itemName);
  
      let updatedItems;
      if (existingItem) {
        // If the item is already purchased, update the purchase method
        updatedItems = prevState.purchasedItems.map(item =>
          item.name === itemName ? { ...item, coinPurchased: true } : item
        );
      } else {
        // If the item is not already purchased, add it to the purchasedItems array
        updatedItems = [
          ...prevState.purchasedItems,
          { name: itemName, coinPurchased: true, divinePointPurchase: false }
        ];
      }

      return {
        ...prevState,
        wealth: prevState.wealth - itemCost,
        purchasedItems: updatedItems,
      };
    });
  };



  const filteredSkills = filterSkillsByClassAndAttributes(playerState);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const openPurchaseModal = () => setIsPurchaseModalOpen(true);
  const closePurchaseModal = () => setIsPurchaseModalOpen(false);

  const openClassChangeModal = () => setIsClassChangeModalOpen(true);
  const closeClassChangeModal = () => setIsClassChangeModalOpen(false);

  return (
    <div className="app-container">
      <div className="attribute-container">
        {Object.keys(derivedAttributes).map((key, index) => (
          <AttributeCard 
            key={index}
            name={key} 
            value={derivedAttributes[key]} 
            highlighted={`${highlightedAttributes.includes(key) ? 'highlight' : ''}`}
            />

      ))}
      </div>
      <PlayerInfo
        player={playerState}
        highlightedDivinePoints={highlightedDivinePoints}
        onOpenLocationModal={openLocationModal}
        onOpenPurchaseModal={openPurchaseModal}
        onOpenClassChangeModal={openClassChangeModal}
      />

<SkillList
    skills={filteredSkills.map(skill => ({
      ...skill,
      learnedProgress: playerState.learnedSkills.find(s => s.id === skill.id)?.learned || 0
    }))}
    selectedSkill={selectedSkill}
    onSelectSkill={skill => handleSelectSkill(skill, setSelectedSkill)}
  />

    {isLocationModalOpen && (
      <LocationChangeModal
        isOpen={isLocationModalOpen}
        player={playerState}
        locations={locations}
        currentLocation={playerState.location}
        onLocationChange={(newLocation, updatedWealth) => handleLocationChange(newLocation, updatedWealth)}
        onClose={closeLocationModal}
      />
    )}
    {isPurchaseModalOpen && (
      <PurchaseItemsModal
        isOpen={isPurchaseModalOpen}
        onClose={closePurchaseModal}
        onPurchaseItem={(itemCost, itemName) => handlePurchaseItem(itemCost, itemName)}
        items={items}  // Pass the static items from gameData
        playerItems={playerState.purchasedItems}
        wealth={playerState.wealth}
        playerLocation={playerState.location}
      />
    )}
    {isClassChangeModalOpen && (
      <ClassChangeModal
        isOpen={isClassChangeModalOpen}
        player={playerState}
        onClassChange={newClassName => handleClassChange(newClassName, setPlayerState, setSelectedSkill)}
        onClose={closeClassChangeModal}
      />
    )}
    {isMaxAgeModalOpen && (
      <MaxAgeModal
        isOpen={isMaxAgeModalOpen}
        onClose={() => setIsMaxAgeModalOpen(false)}
        onSoftReset={(newInitialAttributes, updatedItems, updatedLocations, newSelectedLocation) => handleSoftReset(newInitialAttributes, updatedItems, updatedLocations, newSelectedLocation, setPlayerState)}
        attributes={playerState.attributes}
        divinePoints={playerState.dp}
        items={playerState.purchasedItems}  // Pass the static items from gameData
        locations={locations}  // Pass the static locations from gameData
        defaultLocation={playerState.defaultLocation}
        playerItems={playerState.purchasedItems}
        player={playerState}
      />
    )}
  </div>
);
  }
  
  export default App;