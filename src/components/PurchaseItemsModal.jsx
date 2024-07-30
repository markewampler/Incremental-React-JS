import React from 'react';
import PropTypes from 'prop-types';

const items = [
  { name: 'Item 1', cost: 50, effect: { hasItem1: true } },
  { name: 'Item 2', cost: 100, effect: { hasItem2: true } },
];

function PurchaseItemsModal({ isOpen, onClose, onPurchaseItem }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Purchase Items</h2>
        <ul>
          {items.map(item => (
            <li key={item.name}>
              <button onClick={() => onPurchaseItem(item.cost, item.effect)}>
                {item.name} (Cost: {item.cost} coins)
              </button>
            </li>
          ))}
        </ul>
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

PurchaseItemsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPurchaseItem: PropTypes.func.isRequired,
  };
  
  export default PurchaseItemsModal;
