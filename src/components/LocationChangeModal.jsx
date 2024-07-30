import React from 'react';
import PropTypes from 'prop-types';
import { locations } from '../data/playerData';
import { deductWealth } from '../utils/utils';
import LocationList from './LocationList';

function LocationChangeModal({ isOpen, onClose, player, onLocationChange }) {
  if (!isOpen) return null;

  const handleConfirm = (locationName, cost) => {
    const canAfford = player.wealth >= cost;
    const location = locations[locationName];
    const meetsClassDependency = !location.requiresClassDependency || location.classDependencies.includes(player.className);

    if (canAfford && meetsClassDependency) {
      const updatedWealth = deductWealth(player.wealth, cost);
      onLocationChange(locationName, updatedWealth);
      onClose(); // Close modal after confirming
    } else {
      alert('Cannot change location due to insufficient funds or class dependency not met.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Location</h2>
        <LocationList player={player} onLocationSelect={handleConfirm} />
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
