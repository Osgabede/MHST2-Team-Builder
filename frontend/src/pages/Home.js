import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsersContext } from '../hooks/useUsersContext';

// components 
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

const Home = () => {
  // usersContext for local state update
  const {users, dispatch} = useUsersContext();

  // database fetch
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

  // state to manage buttons
  const [action, setAction] = useState(null); 
  const navigate = useNavigate();

  // Handle button clicks
  const handleLoginClick = () => setAction('login');
  const handleRegisterClick = () => setAction('register');
  const handleGuestClick = () => navigate('/Teams');

  return (
    <div className="home">
      {action === 'login' && (
        <LoginForm/>
      )}
      {action === 'register' && (
        <RegisterForm/>
      )}
      <button id="login-button" onClick={handleLoginClick}>Log in</button>
      <button id="register-button" onClick={handleRegisterClick}>Register</button>
      <button id="guest-button" onClick={handleGuestClick}>Continue as guest</button>
    </div>
  )
}

export default Home