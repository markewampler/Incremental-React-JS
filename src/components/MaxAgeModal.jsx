import React, { useState } from 'react';

const MaxAgeModal = ({ isOpen, onClose, player, onSoftReset }) => {
  const [tempAttributes, setTempAttributes] = useState({ ...player.initialAttributes });
  const [dpSpent, setDpSpent] = useState(0);
  const [tempLocationWeights, setTempLocationWeights] = useState({ ...player.startingLocationWeight });

  const handleAttributeChange = (attribute, change) => {
    if (dpSpent + change <= player.dp && (change === 1 || (change === -1 && tempAttributes[attribute].spent > 0))) {
      setTempAttributes(prev => ({
        ...prev,
        [attribute]: {
          value: prev[attribute].value + change,
          spent: (prev[attribute].spent || 0) + change
        }
      }));
      setDpSpent(dpSpent + change);
    }
  };

  const handleLocationWeightChange = (location, change) => {
    if (dpSpent + change <= player.dp && (change === 1 || (change === -1 && tempLocationWeights[location].spent > 0))) {
      setTempLocationWeights(prev => ({
        ...prev,
        [location]: {
          weight: prev[location].weight + change,
          spent: (prev[location].spent || 0) + change
        }
      }));
      setDpSpent(dpSpent + change);
    }
  };

  const handleReset = () => {
    onSoftReset(tempAttributes, tempLocationWeights);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>End of Life</h2>
        <p>You have reached your maximum age. Spend your divine points to influence your next life.</p>
        <div>
          <h3>Attributes</h3>
          {Object.keys(tempAttributes).map(attribute => (
            <div key={attribute}>
              <span>{attribute}: {tempAttributes[attribute].value} </span>
              <button onClick={() => handleAttributeChange(attribute, 1)}>+</button>
              <button onClick={() => handleAttributeChange(attribute, -1)} disabled={(tempAttributes[attribute].spent || 0) === 0}>-</button>
            </div>
          ))}
        </div>
        <div>
          <h3>Starting Location Weights</h3>
          {Object.keys(tempLocationWeights).map(location => (
            <div key={location}>
              <span>{location}: {tempLocationWeights[location].weight} </span>
              <button onClick={() => handleLocationWeightChange(location, 1)}>+</button>
              <button onClick={() => handleLocationWeightChange(location, -1)} disabled={(tempLocationWeights[location].spent || 0) === 0}>-</button>
            </div>
          ))}
        </div>
        <div>
          <p>Divine Points Spent: {dpSpent} / {player.dp}</p>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default MaxAgeModal;
