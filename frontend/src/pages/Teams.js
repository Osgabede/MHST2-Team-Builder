import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Teams = () => {
  const { id } = useParams(); // Destructure 'id' from params
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        setUser(json); // Save user data to state
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getUser();
  }, [id]); // Re-run effect if 'id' changes

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (!user) {
    return <p>User not found!</p>; // Handle case where user data is not found
  }

  return (
    <div className="teams-page">
      <h1>This is the teams page</h1>
      <p>{/* can use anything from the user here with user.field*/}</p>
    </div>
  );
};

export default Teams;
