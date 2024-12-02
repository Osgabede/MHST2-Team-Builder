import { useEffect, useState } from 'react';
import { useUsersContext } from '../hooks/useUsersContext';
import { useNavigate } from 'react-router-dom';
import TeamCard from '../components/TeamCard';

const Teams = () => {
  const { auth } = useUsersContext();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate('/');
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${auth.user._id}/teams`, {
          headers: { 'Authorization': `Bearer ${auth.token}` },
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

  const handleCreateTeam = async () => {
    const teamName = prompt('Enter the name of the new team:');
    if (!teamName) {
      return; // User canceled or left the prompt empty
    }

    try {
      const response = await fetch(`http://localhost:4000/api/users/${auth.user._id}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`, // Include the token for authentication
        },
        body: JSON.stringify({ name: teamName }), // Send the team name
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new team to the state
        setTeams((prevTeams) => [...prevTeams, data]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setError('An error occurred while creating the team.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teams">
      <h2>{auth?.user?.username}'s Teams</h2>
      <p>Click on any team to edit it</p>
      <div id="teams-box">
        {teams.length === 0 ? (
          <p>You don't have any teams yet.</p>
        ) : (
          teams.map((team) => <TeamCard key={team._id} team={team} />)
        )}
      </div>
      <button id="create-team-button" onClick={handleCreateTeam}>
        Add a new Team
      </button>
    </div>
  );
};

export default Teams;
