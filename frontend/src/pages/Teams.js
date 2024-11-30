import { useEffect, useState } from 'react';
import { useUsersContext } from '../hooks/useUsersContext';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const { auth, dispatch } = useUsersContext();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure that the user is authenticated before making the request
    if (!auth || !auth.user) {
      navigate('/');
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${auth.user._id}/teams`, {
          headers: {
            'Authorization': `Bearer ${auth.token}` // Include the token for authentication
          }
        });
        const data = await response.json();

        if (response.ok) {
          setTeams(data.teams);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('An error occurred while fetching teams.');
      }
    };

    fetchTeams();
  }, [auth, navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teams">
      <h2>Your Teams</h2>
      {teams.length === 0 ? (
        <p>You don't have any teams yet.</p>
      ) : (
        <ul>
          {teams.map(team => (
            <li key={team._id}>{team.name}</li> // Adjust the properties as needed
          ))}
        </ul>
      )}
    </div>
  );
};

export default Teams;
