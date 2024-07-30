import React from 'react';
import Skill from './Skill';

function SkillList({ skills, selectedSkill, onSelectSkill }) {
  return (
    <div className="skill-list">
      {skills.map((skill, index) => (
        <Skill 
          key={index} 
          skill={skill} 
          onClick={onSelectSkill} 
          isSelected={selectedSkill && selectedSkill.name === skill.name}
        />
      ))}
    </div>
  );
}

export default SkillList;
