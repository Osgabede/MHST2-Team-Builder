import { useState, useEffect } from 'react';
import MonstieBox from './MonstieBox';

const TeamCard = ({ team, onClick, isSelected, onAddMonstieClick }) => {
  const [showEditButtons, setShowEditButtons] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setShowEditButtons(true);
    } else {
      setShowEditButtons(false);
    }
  }, [isSelected]);

  return (
    <div className={`team-box ${isSelected ? 'selected' : 'blue-on-hover'}`} onClick={onClick}>
      <div className="team-title">
        <h2>{team.name}</h2>
        {showEditButtons && (
          <button aria-label="EditTeamName" className="edit-team-button">
            <i className="fas fa-pencil-alt"></i>
          </button>
        )}
      </div>
      {Array.from({ length: 6 }).map((_, index) => {
        if (team.monsties[index]) {
          return (
            <MonstieBox 
              key={`monstie-${team.monsties[index]._id || index}`} 
              monstie={team.monsties[index]} 
              isSelected={isSelected}
            />
          );
        } else {
          return (
            showEditButtons && (
              <button 
                key={`add-monstie-${index}`} 
                className={`add-monstie-button ${isSelected ? 'blue-on-hover' : ''}`} 
                onClick={onAddMonstieClick}
              >
                +
              </button>
            )
          );
        }
      })}
    </div>
  );
};

export default TeamCard;
