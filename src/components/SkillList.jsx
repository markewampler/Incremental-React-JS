import React from 'react';
import PropTypes from 'prop-types';
import Skill from './Skill';

function SkillList({ skills, selectedSkill, onSelectSkill }) {
  return (
    <div className="skill-list">
      {skills.map(skill => (
        <Skill
          key={skill.id}
          skill={skill}
          learnedProgress={skill.learnedProgress}
          onClick={onSelectSkill}
          isSelected={selectedSkill?.id === skill.id}
        />
      ))}
    </div>
  );
}

SkillList.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedSkill: PropTypes.object,
  onSelectSkill: PropTypes.func.isRequired,
};

export default SkillList;