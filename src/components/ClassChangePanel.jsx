import React from 'react';
import PropTypes from 'prop-types';
import ClassChangeButton from './ClassChangeButton';

function ClassChangePanel({ availableClasses, onClassChange }) {
  return (
    <div className="class-change-panel">
      {availableClasses.map((className = 'Peasant', index) => (
        <ClassChangeButton
          key={index}
          className={className}
          onClick={onClassChange}
        />
      ))}
    </div>
  );
}

ClassChangePanel.propTypes = {
  availableClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClassChange: PropTypes.func.isRequired,
};

export default ClassChangePanel;
