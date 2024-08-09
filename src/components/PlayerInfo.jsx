import React from 'react';
import PropTypes from 'prop-types';

function PlayerInfo({ player, onOpenLocationModal, onOpenPurchaseModal, onOpenClassChangeModal, highlightedDivinePoints }) {
  return (
    <div className="player-info">
      <div className="player-info-box age">
        <div><h3>Age: {player.age}</h3></div>
        <div><h3>Maximum Age: {player.maxAge}</h3></div>
      </div>
      
      <div className={`player-info-box ${highlightedDivinePoints ? 'highlight' : ''}`}>
          <h3>Divine Points:</h3>
          <h3>{player.dp}</h3>
      </div>
      
      <div className="player-info-box location">
        <div><h3>Location: {player.location}</h3></div>
        <button onClick={onOpenLocationModal}>Change Location</button>
      </div>
      <div className="player-info-box wealth">
        <div><h3>Wealth: {player.wealth} coins</h3></div>
        <button onClick={onOpenPurchaseModal}>Purchase Items</button>
      </div>
      <div className="player-info-box class">
        <div><h3>Class: {player.className}</h3></div>
        <button onClick={onOpenClassChangeModal}>Change Class</button>
      </div>
    </div>
  );
}

PlayerInfo.propTypes = {
  player: PropTypes.object.isRequired,
  onOpenLocationModal: PropTypes.func.isRequired,
  onOpenPurchaseModal: PropTypes.func.isRequired,
  onOpenClassChangeModal: PropTypes.func.isRequired,
};

export default PlayerInfo;
