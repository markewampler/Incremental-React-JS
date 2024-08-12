import React, { useState, useEffect } from 'react';
import { items as gameItems, locations as gameLocations } from '../data/gameData';

const MaxAgeModal = ({ isOpen, onClose, onSoftReset, attributes, divinePoints, playerItems, defaultLocation, player }) => {
  const [availableDivinePoints, setAvailableDivinePoints] = useState(divinePoints);
  const [tempAttributes, setTempAttributes] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [updatedLocations, setUpdatedLocations] = useState({});

  useEffect(() => {
    if (isOpen) {
      setAvailableDivinePoints(divinePoints);
      setTempAttributes({ ...attributes });
      setInitialValues(Object.keys(attributes).reduce((acc, key) => {
        acc[key] = attributes[key].value;
        return acc;
      }, {}));
  
      // Ensure 'Forest' is always a purchased location
      const playerPurchasedLocations = [...(player.purchasedLocations || [])];
      if (!playerPurchasedLocations.includes('Forest')) {
        playerPurchasedLocations.push('Forest');
      }
  
      // Merge playerItems with gameItems to ensure all items are present
      const mergedItems = gameItems.map(item => {
        const playerItem = playerItems.find(pItem => pItem.name === item.name);
        return playerItem ? { ...item, ...playerItem } : { ...item, coinPurchased: false, divinePointPurchase: false };
      });
      setUpdatedItems(mergedItems);
  
      setSelectedLocation(defaultLocation);
    }
  }, [isOpen, divinePoints, attributes, playerItems, defaultLocation]);

  const handleAttributeChange = (attribute, amount) => {
    if (availableDivinePoints >= amount && (amount > 0 || tempAttributes[attribute].value + amount >= initialValues[attribute])) {
      setTempAttributes(prevAttributes => ({
        ...prevAttributes,
        [attribute]: {
          ...prevAttributes[attribute],
          value: prevAttributes[attribute].value + amount
        }
      }));
      setAvailableDivinePoints(prevPoints => prevPoints - amount);
    }
  };

  const handlePurchaseItem = (index, divinePointCost) => {
    if (availableDivinePoints >= divinePointCost) {
      setAvailableDivinePoints(prevPoints => prevPoints - divinePointCost);
      setUpdatedItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index].divinePointPurchase = true;
        return newItems;
      });
    }
  };

  const handlePurchaseLocation = (locationKey, divinePointCost) => {
    if (availableDivinePoints >= divinePointCost) {
      setAvailableDivinePoints(prevPoints => prevPoints - divinePointCost);
      setUpdatedLocations(prevLocations => {
        const newLocations = { ...prevLocations };
        if (!player.purchasedLocations.includes(locationKey)) {
          player.purchasedLocations.push(locationKey); // Add location to purchasedLocations
        }
        return newLocations;
      });
    }
  };

  const handleSelectLocation = (locationKey) => {
    setSelectedLocation(locationKey);
  };

  const handleSoftReset = () => {
    const newInitialAttributes = Object.keys(tempAttributes).reduce((acc, key) => {
      acc[key] = {
        value: tempAttributes[key].value,
        increasedValue: 0
      };
      return acc;
    }, {});

    const itemsAfterReset = updatedItems.filter(item => item.divinePointPurchase);
    const locationsAfterReset = Object.keys(updatedLocations).filter(key => updatedLocations[key].divinePointPurchase);

    onSoftReset(newInitialAttributes, itemsAfterReset, locationsAfterReset, selectedLocation);
    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Max Age Reached</h2>
          <p>You have {availableDivinePoints} divine points to spend on permanent upgrades below:</p>
          <div className="modal-container">
            <div className='dp-attribute-container bordered-container'>
              <h3>Attribute Values</h3>
              {Object.keys(tempAttributes).map(key => (
                <div key={key} className="attribute-control">
                  <div className="attribute-name">{key}</div>
                  <div className="attribute-buttons">
                    {divinePoints >= 5 && <button className="attribute-button" onClick={() => handleAttributeChange(key, 5)} disabled={availableDivinePoints < 5}>+5</button>}
                    <button className="attribute-button" onClick={() => handleAttributeChange(key, 1)} disabled={availableDivinePoints < 1}>+1</button>
                    <div className="attribute-value">{tempAttributes[key].value}</div>
                    <button className="attribute-button" onClick={() => handleAttributeChange(key, -1)} disabled={tempAttributes[key].value <= initialValues[key]}>-1</button>
                    {initialValues[key] + 4 < tempAttributes[key].value && <button className="attribute-button" onClick={() => handleAttributeChange(key, -5)} disabled={tempAttributes[key].value <= initialValues[key] + 4}>-5</button>}
                  </div>
                </div>
              ))}
            </div>

            <div className="items-container bordered-container">
              <h3>Items</h3>
              <ul>
                {gameItems.map((item, index) => {
                  const playerItem = updatedItems.find(pItem => pItem.name === item.name);
                  const isPurchased = playerItem && (playerItem.divinePointPurchase);

                  return (
                    <li key={index} style={{ whiteSpace: 'nowrap' }}>
                      <button 
                        className={isPurchased ? 'purchased-item-button' : ''}
                        onClick={() => handlePurchaseItem(index, item.divinePointCost)}
                        disabled={availableDivinePoints < item.divinePointCost || isPurchased}
                      >
                        {isPurchased ? `Purchased - ${item.name}` : `${item.name} - Cost: ${item.divinePointCost}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="locations-container bordered-container">
              <h3>Locations</h3>
              <ul>
                {Object.keys(gameLocations).map((locationKey, index) => {
                  const location = gameLocations[locationKey];
                  const isPurchased = player.purchasedLocations.includes(locationKey);

                  return (
                    <li key={index} style={{ whiteSpace: 'nowrap' }}>
                      <button
                        className={isPurchased ? 'purchased-item-button' : ''}
                        onClick={() => handlePurchaseLocation(locationKey, location.divinePointCost)}
                        disabled={availableDivinePoints < location.divinePointCost || isPurchased}
                      >
                        {isPurchased ? `Purchased - ${locationKey}` : `${locationKey} - Cost: ${location.divinePointCost}`}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="default-location-container bordered-container">
                <h4>Default Location</h4>
                <select
                  value={selectedLocation}
                  onChange={(e) => handleSelectLocation(e.target.value)}
                >
                  {Object.keys(gameLocations).map((locationKey, index) => {
                    const isPurchased = player.purchasedLocations.includes(locationKey);
                    return isPurchased ? (
                      <option key={index} value={locationKey}>
                        {locationKey}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
            </div>

            
          </div>
          {availableDivinePoints > 0 ? <p className="warning-text">You must spend all divine points before proceeding.</p> : <p className="success-text">You have spent all your divine points proceed!</p>}
          <button onClick={handleSoftReset} disabled={availableDivinePoints > 0}><h3>Start over with new values!</h3></button>
        </div>
      </div>
    )
  );
};

export default MaxAgeModal;