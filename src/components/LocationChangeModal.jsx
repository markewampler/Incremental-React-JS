import React from 'react';
import PropTypes from 'prop-types';
import { locations } from '../data/gameData';
import { deductWealth } from '../utils/utils';

function LocationChangeModal({ isOpen, onClose, player, onLocationChange }) {
  if (!isOpen) return null;

  const handleConfirm = (locationName, cost) => {
    const isPurchased = player.purchasedLocations.includes(locationName);
    const finalCost = isPurchased ? 0 : cost;
    const canAfford = player.wealth >= finalCost;
    
    if (canAfford) {
      const updatedWealth = deductWealth(player.wealth, finalCost);
      onLocationChange(locationName, updatedWealth);
      onClose(); // Close modal after confirming
    } else {
      alert('Cannot change location due to insufficient funds.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Location</h2>
        <div>
          {Object.keys(locations).map(locationName => {
            const location = locations[locationName];
            const isCurrentLocation = player.location === locationName;
            const isPurchased = player.purchasedLocations.includes(locationName);
            const finalCost = isPurchased ? 0 : location.cost;
            const canChangeLocation = player.wealth >= finalCost;

            return (
              <div key={locationName} className={`location-item ${isCurrentLocation ? 'current-location' : ''}`}>
                <button
                  onClick={() => handleConfirm(locationName, finalCost)}
                  disabled={!canChangeLocation || isCurrentLocation}
                  className={isCurrentLocation ? 'current-location-button' : ''}
                >
                  {isCurrentLocation ? `Your Current Location - ${locationName}` : `${locationName} - Cost: ${finalCost} coins`}
                </button>
              </div>
            );
          })}
        </div>
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

LocationChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default LocationChangeModal;