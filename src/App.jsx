import React, { useState, useEffect } from 'react';
import './App.css';
import AttributeCard from './components/AttributeCard';
import PlayerInfo from './components/PlayerInfo';
import SkillList from './components/SkillList';
import ClassList from './components/ClassList';
import { player, calculateMaxAge } from './data/playerData';
import { 
    getAttributes, 
    increaseAttribute, 
    calculateLearningSpeed, 
    filterSkillsByClassAndAttributes, 
    filterClassesByLocationAndAttributes, 
    deductWealth, 
    addWealth } from './utils/utils';
import LocationChangeModal from './components/LocationChangeModal';
import { locations } from './data/playerData';
import PurchaseItemsModal from './components/PurchaseItemsModal';
import ClassChangeModal from './components/ClassChangeModal';
import DivinePointsModal from './components/DivinePointsModal';
import MaxAgeModal from './components/MaxAgeModal';


function App() {
  const [playerState, setPlayerState] = useState({
    ...player,
    wealth: player.wealth,
    initialAttributes: player.attributes,
  });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [highlightedAttributes, setHighlightedAttributes] = useState([]);
  const [ageInterval, setAgeInterval] = useState(1000); // 1 second per age increase
  const [availableClasses, setAvailableClasses] = useState(filterClassesByLocationAndAttributes(player));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isClassChangeModalOpen, setIsClassChangeModalOpen] = useState(false);
  const [isDivinePointsModalOpen, setIsDivinePointsModalOpen] = useState(false);
  const [isMaxAgeModalOpen, setIsMaxAgeModalOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    const newMaxAge = calculateMaxAge(playerState.attributes, playerState.location);
    setPlayerState(prevState => ({
        ...prevState,
        maxAge: newMaxAge

    }));
  }, [playerState.attributes, playerState.location]);

  useEffect(() => {
    if (gameStarted && playerState.age >= playerState.maxAge) {
      const earnedDP = calculateDivinePoints(player.initialAttributes, player.attributes);
        setPlayerState(prevState => ({
          ...prevState,
          dp: earnedDP
        }))  
        setIsMaxAgeModalOpen(true);
        setGamePaused(true); // Pause the game
    }
  }, [playerState.age, playerState.maxAge, gameStarted]);

  useEffect(() => {
    // Assume game starts when component mounts
    setGameStarted(true);
  }, []);

  useEffect(() => {
    const filteredSkills = filterSkillsByClassAndAttributes(playerState);

    if (!selectedSkill && filteredSkills.length > 0) {
      setSelectedSkill(filteredSkills[0]);
    }
  }, [playerState, selectedSkill]);


  useEffect(() => {
    if (!selectedSkill || gamePaused) return; // Add gamePaused condition here

    const interval = setInterval(() => {
        setPlayerState(prevState => {
            const newPlayerState = { ...prevState };
            const skill = newPlayerState.skills.find(s => s.name === selectedSkill.name);
            const learningSpeed = calculateLearningSpeed(newPlayerState, skill);

            skill.learned = Math.min(skill.learned + learningSpeed, skill.learningTime);

            if (skill.learned >= skill.learningTime) {
                // Update attributes
                Object.entries(skill.effects).forEach(([attr, amount]) => {
                    if (newPlayerState.attributes[attr]) {
                        newPlayerState.attributes[attr].value += amount;
                    }
                });

                // Highlight attributes
                setHighlightedAttributes(Object.keys(skill.effects));

                // Reset skill progress
                skill.learned = 0;

                // Update wealth
                newPlayerState.wealth = addWealth(newPlayerState.wealth, parseInt(skill.moneyEarned));
            }

            return newPlayerState;
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSkill, gamePaused]);

  useEffect(() => {
    if (gamePaused) return; // Add gamePaused condition here

    const ageIntervalId = setInterval(() => {
      setPlayerState(prevState => ({
        ...prevState,
        age: prevState.age + 1
      }));
    }, ageInterval);

    return () => clearInterval(ageIntervalId);
  }, [ageInterval, gamePaused]);

  useEffect(() => {
    if (highlightedAttributes.length > 0) {
      const timeoutId = setTimeout(() => {
        setHighlightedAttributes([]);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [highlightedAttributes]);

  const handleIncreaseAttribute = (name, amount) => {
    increaseAttribute(playerState, name, amount);
    setPlayerState({ ...playerState });
  };

  const handleSelectSkill = (skill) => {
    setSelectedSkill(skill);
  };

  const handleClassChange = (newClassName) => {
    setPlayerState(prevState => ({ ...prevState, className: newClassName }));
    setSelectedSkill(null); // Clear the selected skill when the class changes
  };

  const handleLocationChange = (newLocation, updatedWealth) => {
    setPlayerState(prevState => ({
      ...prevState,
      location: newLocation,
      wealth: updatedWealth
    }));
    console.log(playerState)
    setAvailableClasses(filterClassesByLocationAndAttributes({ ...playerState, location: newLocation }));
    setSelectedSkill(null); // Clear the selected skill when the location changes
  };

  const handlePurchaseItem = (itemCost, itemEffect) => {
    if (playerState.wealth >= itemCost) {
      setPlayerState(prevState => ({
        ...prevState,
        wealth: deductWealth(prevState.wealth, itemCost),
        ...itemEffect
      }));
    } else {
      alert('Insufficient funds to purchase this item.');
    }
  };

  const handleSpendDP = (type, value) => {
    if (type.startsWith('attribute-')) {
        const attribute = type.split('-')[1];
        setPlayerState(prevState => ({
            ...prevState,
            dp: prevState.dp - value,
            attributes: {
                ...prevState.attributes,
                [attribute]: { value: prevState.attributes[attribute].value + 1 }
            }
        }));
    } else if (type.startsWith('location-')) {
        const location = type.split('-')[1];
        setPlayerState(prevState => ({
            ...prevState,
            dp: prevState.dp - value,
            startingLocationWeight: {
                ...prevState.startingLocationWeight,
                [location]: prevState.startingLocationWeight[location] + 1
            }
        }));
    }
};

const calculateDivinePoints = (initialAttributes, finalAttributes) => {
  let initialTotal = 0;
  let finalTotal = 0;
  console.log(initialTotal + ' Initial')
  console.log(finalTotal + ' Initial')
  for (const attr in initialAttributes) {
      initialTotal += initialAttributes[attr].value;
  }
  for (const attr in finalAttributes) {
    finalTotal += finalAttributes[attr].value;
}
console.log(initialTotal + ' After')
console.log(finalTotal + ' After')
  return Math.floor((finalTotal - initialTotal) / 5);
};

const handleSoftReset = (newAttributes, newLocationWeights) => {
  const newLocation = 'Rural'

  console.log(newAttributes)

  setPlayerState(prevState => ({
      ...prevState,
      age: 8,
      wealth: 0,
      location: newLocation,
      attributes: newAttributes,
      initialAttributes: newAttributes,
      startingLocationWeight: newLocationWeights,
      dp: prevState.dp,
  }));
  console.log(playerState)
  setIsMaxAgeModalOpen(false);
  setGamePaused(false); // Resume the game
};

  const attributes = getAttributes(playerState);
  const filteredSkills = filterSkillsByClassAndAttributes(playerState);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const openPurchaseModal = () => setIsPurchaseModalOpen(true);
  const closePurchaseModal = () => setIsPurchaseModalOpen(false);

  const openClassChangeModal = () => setIsClassChangeModalOpen(true);
  const closeClassChangeModal = () => setIsClassChangeModalOpen(false);
  
  const openDivinePointsModal = () => setIsDivinePointsModalOpen(true);
  const closeDivinePointsModal = () => setIsDivinePointsModalOpen(false);


  return (
    <div className="app-container">
      <div className="attribute-container">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className={`attribute-card ${highlightedAttributes.includes(attr.name) ? 'highlight' : ''}`}
          >
            <AttributeCard name={attr.name} value={attr.value} />
          </div>
        ))}
      </div>
      <PlayerInfo
        player={playerState}
        onOpenLocationModal={openLocationModal}
        onOpenPurchaseModal={openPurchaseModal}
        onOpenClassChangeModal={openClassChangeModal}
        onOpenDivinePointsModal={openDivinePointsModal}
      />

      <SkillList skills={filteredSkills} selectedSkill={selectedSkill} onSelectSkill={handleSelectSkill} />


      {isLocationModalOpen && (
        <LocationChangeModal
          isOpen={isLocationModalOpen}
          player={playerState}
          locations={locations}
          currentLocation={playerState.location}
          onLocationChange={handleLocationChange}
          onClose={closeLocationModal}
        />
      )}
      {isPurchaseModalOpen && (
        <PurchaseItemsModal
          player={playerState}
          isOpen={isPurchaseModalOpen}
          onClose={closePurchaseModal}
          onPurchaseItem={handlePurchaseItem}
        />
      )}
      {isClassChangeModalOpen && (
        <ClassChangeModal
          isOpen={isClassChangeModalOpen}
          player={playerState}
          onClassChange={handleClassChange}
          onClose={closeClassChangeModal}
        />
      )}
      {isDivinePointsModalOpen && (
        <DivinePointsModal
          isOpen={isDivinePointsModalOpen}
          onClose={closeDivinePointsModal}
          player={playerState}
          onSpendDP={handleSpendDP}
        />
      )}

      {isMaxAgeModalOpen && (<MaxAgeModal
                isOpen={isMaxAgeModalOpen}
                onClose={() => setIsMaxAgeModalOpen(false)}
                player={playerState}
                onSpendDP={handleSpendDP}
                onSoftReset={handleSoftReset}
            />
      )}
    </div>
  );
}

export default App;
