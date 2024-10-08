import React from 'react';
import PropTypes from 'prop-types';

function AttributeCard({ name, value, highlighted }) {
  return (
    <div className={`attribute-card ${highlighted ? 'highlight' : ''}`}>
        <h2>{value}</h2>
        <p>{name}</p>
    </div>
  );
}

AttributeCard.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default AttributeCard;
