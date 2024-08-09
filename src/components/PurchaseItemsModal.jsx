import React from 'react';
import PropTypes from 'prop-types';

function PurchaseItemsModal({ isOpen, onClose, onPurchaseItem, items, wealth, playerItems, playerLocation }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Purchase Items</h2>
        <ul>
        {items.filter(item => item.locationDependency.includes(playerLocation)).map(item => {
            const playerItem = playerItems.find(pItem => pItem.name === item.name);
            const isPurchased = playerItem && (playerItem.coinPurchased || playerItem.divinePointPurchase);

            return (
              <li key={item.name} className={isPurchased ? 'purchased-item' : ''}>
                <button
                  className={isPurchased ? 'purchased-item-button' : ''}
                  onClick={() => onPurchaseItem(item.cost, item.name)}
                  disabled={wealth < item.cost || isPurchased}
                >
                  {isPurchased ? `Purchased - ${item.name}` : `${item.name} (Cost: ${item.cost} coins)`}
                </button>
              </li>
            );
          })}
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
  items: PropTypes.array.isRequired,
  wealth: PropTypes.number.isRequired,
  playerItems: PropTypes.array.isRequired,
};

export default PurchaseItemsModal;