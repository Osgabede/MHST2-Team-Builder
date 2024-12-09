import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';
import TeamCard from '../components/TeamCard';
import MonstieModal from '../components/MonstieFilterModal'; // Import the new modal component

const EditTeam = () => {
  const { auth } = useUsersContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monsties, setMonsties] = useState([]); // Holds the list of available monsties

  useEffect(() => {
    if (!location.state || !location.state.team) {
      navigate('/'); // Redirect if no team is passed
      return;
    }
    setTeam(location.state.team);

    // Fetch available monsties
    const fetchMonsties = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/monsties`);
        if (!response.ok) {
          throw new Error('Failed to fetch monsties');
        }
        const data = await response.json();
        setMonsties(data);
      } catch (error) {
        console.error('Error fetching monsties:', error);
        setError('An error occurred while fetching monsties.');
      }
    };

    fetchMonsties();
  }, [location, navigate]);

  const handleAddMonstieClick = () => {
    setIsModalOpen(true);
  };

  const handleSelectMonstie = async (selectedMonstie) => {
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${auth.user._id}/teams/${team._id}/monsties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ monstieId: selectedMonstie._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setTeam(data.team);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error adding the monstie:', err);
      setError('An error occurred while adding the monstie.');
    }

    setIsModalOpen(false); // Close the modal
  };

  if (!team) {
    return <div>Loading...</div>; // Display a loading message while the team is being fetched
  }

  return (
    <div id="edit-team">
      <h2>Editing Team:</h2>
      <p>Click on any monstie to edit it</p>
      <TeamCard
        team={team}
        onClick={() => {}}
        isSelected={true} // Mark as selected or set your own logic
        onAddMonstieClick={handleAddMonstieClick} // Pass function to handle click event
      />
      <MonstieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMonstie={handleSelectMonstie}
        monsties={monsties}
      />
    </div>
  );
};

export default EditTeam;
