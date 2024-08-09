import React from 'react';
import PropTypes from 'prop-types';

function Skill({ skill, learnedProgress, onClick, isSelected = false }) {

  const progress = skill.learningTime > 0 ? (learnedProgress / skill.learningTime) * 100 : 0;

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
        <div className="skill-extra">{skill.moneyEarned} coins</div>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

Skill.propTypes = {
  skill: PropTypes.object.isRequired,
  learnedProgress: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default Skill;