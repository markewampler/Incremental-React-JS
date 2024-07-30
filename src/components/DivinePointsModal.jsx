import React from 'react';
import PropTypes from 'prop-types';

function DivinePointsModal({ isOpen, onClose, player, onSpendDP }) {
    if (!isOpen) return null;

    const handleSpendDP = (type, value) => {
        if (player.dp >= value) {
            onSpendDP(type, value);
        } else {
            alert('Not enough DP');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Spend Divine Points</h2>
                <p>You can spend divine points to increase the base values of attributes or increase the weight associated with starting locations.</p>
                <div>
                    <h3>Increase Attributes</h3>
                    {Object.keys(player.attributes).map(attr => (
                        <div key={attr}>
                            <button onClick={() => handleSpendDP(`attribute-${attr}`, 1)}>Increase {attr}</button>
                        </div>
                    ))}
                </div>
                <div>
                    <h3>Increase Starting Location Weight</h3>
                    {Object.keys(player.startingLocationWeight).map(location => (
                        <div key={location}>
                            <button onClick={() => handleSpendDP(`location-${location}`, 1)}>Increase Weight for {location}</button>
                        </div>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

DivinePointsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    onSpendDP: PropTypes.func.isRequired,
};

export default DivinePointsModal;
