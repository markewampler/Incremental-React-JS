import React from 'react';
import PropTypes from 'prop-types';
import { classes } from '../data/playerData';

function ClassList({ player, onClassSelect }) {
  const availableClasses = classes.filter((classItem) =>
    classItem.locationDependency.includes(player.location)
  );

  return (
    <div className="class-list">
      {availableClasses.map((classItem) => (
        <button className="class-list-button" key={classItem.name} onClick={() => onClassSelect(classItem.name)}>
          {classItem.name}
        </button>
      ))}
    </div>
  );
}

ClassList.propTypes = {
  player: PropTypes.object.isRequired,
  onClassSelect: PropTypes.func.isRequired,
};

export default ClassList;
