import React from 'react';
import PropTypes from 'prop-types';

function Skill({ skill, onClick, isSelected = false }) {
  // Ensure skill.learned and skill.learningTime are valid numbers
  const progress = skill.learningTime > 0 ? (skill.learned / skill.learningTime) * 100 : 0;

  // Create a div for each attribute effect
  const effects = Object.entries(skill.effects).map(([attr, amount]) => (
    <div key={attr} className="skill-effect">{`${attr}: +${amount}`}</div>
  ));

  return (
    <div 
      className={`skill ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(skill)}
    >
      <div className="skill-info">
        <div className="skill-name">{skill.name}</div>
        <div className="skill-effects">{effects}</div>
        <div className="skill-extra">{skill.moneyEarned}</div> {/* Display money earned */}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default Skill;
