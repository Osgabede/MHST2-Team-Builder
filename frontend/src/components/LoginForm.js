import { useState } from "react";
import { useUsersContext } from '../hooks/useUsersContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { dispatch } = useUsersContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    let user = { username, password };
    let emptyFields = '';

    for (let [name, value] of Object.entries(user)) {
      if (!value) {
        emptyFields += `<p>${name} is empty</p>`;
      }
    }

    if (!emptyFields) {
      // Proceed with the login request if no fields are empty
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      const json = await response.json();

      if (response.ok) {
        // Save user and token to context
        dispatch({ type: 'SET_AUTH', payload: { user: json.user, token: json.token } });
        setUsername('');
        setPassword('');
        setError('');
        console.log('Login successful', json);

        // Redirect to the Teams page
        navigate('/Teams/' + json.user.username);
      } else {
        setError(json.error);
      }
    } else {
      // Set error message if there are empty fields
      setError(emptyFields);
    }
  }

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <h3>Login</h3>

      <label>Username:</label>
      <input 
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <label>Password:</label>
      <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button>Log In</button>

      {error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}
    </form>
  )
};

export default LoginForm;
