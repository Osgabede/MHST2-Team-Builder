import { useEffect } from 'react';
import { useUsersContext } from '../hooks/useUsersContext';

// components 
import RegisterForm from '../components/RegisterForm';
import UserDetails from '../components/UserDetails';

const Home = () => {
  const {users, dispatch} = useUsersContext();

  useEffect(() => {
    const fetchUsers = async () => {
      // full URL for now, I wanna route it using setupProxy.js but it currently doesn't work
      const response = await fetch('http://localhost:4000/api/users');
      const json = await response.json();
      
      if (response.ok) {
        dispatch({type: 'SET_USERS', payload: json});
      }
    }

    fetchUsers();
  }, [])

  return (
    <div className="home">
      <div className="users">
        {users && users.map((user) => (
          <UserDetails key={user._id} user={user}/>
        ))}
      </div>
      <RegisterForm/>
    </div>
  )
}

export default Home