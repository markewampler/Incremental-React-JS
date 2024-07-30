import React from 'react';
import PropTypes from 'prop-types';
import ClassList from './ClassList';

function ClassChangeModal({ isOpen, onClose, player, onClassChange }) {
  if (!isOpen) return null;

  const handleClassSelect = (className) => {
    onClassChange(className);
    onClose(); // Close modal after selecting class
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Class</h2>
        <ClassList player={player} onClassSelect={handleClassSelect} />
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

ClassChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  onClassChange: PropTypes.func.isRequired,
};

export default ClassChangeModal;
