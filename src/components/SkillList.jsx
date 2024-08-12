import React from 'react';
import PropTypes from 'prop-types';
import Skill from './Skill';

function SkillList({ skills, selectedSkill, onSelectSkill }) {
  // Sort skills to have available ones first
  const sortedSkills = skills.sort((a, b) => {
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;
    return 0;
  });

  return (
    <div className="skill-list">
      {sortedSkills.map(skill => (
        <Skill 
          key={skill.id}
          skill={skill}
          learnedProgress={skill.learnedProgress || 0}
          onClick={onSelectSkill}
          isSelected={selectedSkill && selectedSkill.id === skill.id}
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