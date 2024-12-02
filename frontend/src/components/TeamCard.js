import { useState } from 'react';
import MonstieBox from './MonstieBox';

const TeamCard = ({ team }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState(team.name);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const handleNameSave = () => {
    // Add logic to save the updated team name to the server here
    setIsEditing(false);
  };

  return (
    <div className="team-box blue-on-hover">
      <div className="team-title">
        {isEditing ? (
          <input
            type="text"
            value={teamName}
            onChange={handleNameChange}
            onBlur={handleNameSave}
            autoFocus
          />
        ) : (
          <h2 onClick={handleEditToggle}>{teamName}</h2>
        )}
      </div>
      <div className="monsties-container">
        {team.monsties.map((monstie) => (
          <MonstieBox key={monstie._id} monstie={monstie} />
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
