import { useEffect, useState } from 'react';
import { useUsersContext } from '../hooks/useUsersContext';
import { useNavigate } from 'react-router-dom';
import TeamCard from '../components/TeamCard';

const Teams = () => {
  const { auth } = useUsersContext();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate('/');
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${auth.user._id}/teams`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setTeams(data.teams);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('An error occurred while fetching teams.');
      }
    };

    fetchTeams();
  }, [auth, navigate]);

  // ---------------------- Create Team function ----------------------

  const handleCreateTeam = async () => {
    const teamName = prompt('Enter the name of the new team:'); // TO FEAT: Make this open a modal to insert the name

    // TO FEAT: Route into EditTeam page

    if (!teamName) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${auth.user._id}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await response.json();

      if (response.ok) {
        setTeams((prevTeams) => [...prevTeams, data]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setError('An error occurred while creating the team.');
    }
  };

  // ---------------------- Delete Team function ----------------------

  const handleDeleteTeam = async (teamId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${auth.user._id}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
  
      if (response.ok) {
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId)); // Update the UI
      } else {
        const data = await response.json();
        console.error('Error deleting team:', data.error);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };
  

  // ---------------------- Team Box Click function ----------------------

  const handleTeamClick = (team) => {
    setSelectedTeam(team); // Update state to set the selected team
    const formattedName = team.name.replace(/ /g, '_');
    navigate(`/Teams/${auth?.user?.username}/${formattedName}`, { state: { team } });
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div id="teams">
      <h2>{auth?.user?.username}'s Teams</h2>
      <p>Click on any team to edit it</p>
      <div id="teams-box-wrapper">
        <div id="teams-box">
          {teams.length === 0 ? (
            <p id="no-teams-message">You don't have any teams yet.</p>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                onClick={() => handleTeamClick(team)}
                isSelected={selectedTeam && selectedTeam._id === team._id}
                onDeleteTeamClick={() => handleDeleteTeam(team._id)}
              />
            ))
          )}
        </div>
      </div>
      <button id="create-team-button" onClick={handleCreateTeam}>
        Add a new Team
      </button>
    </div>
  );
};

export default Teams;
