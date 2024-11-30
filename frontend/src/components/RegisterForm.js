import { useState } from "react";
import { useUsersContext } from '../hooks/useUsersContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const { dispatch } = useUsersContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let user = {
      username: username,
      email: email,
      password: password
    };

    let emptyFields = '';

    for (let [name, value] of Object.entries(user)) {
      if (!value) {
        emptyFields += `<p>${name} is empty</p>`;
      }
    }

    if (!emptyFields) {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const json = await response.json();

      if (response.ok) {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        console.log('New user added', json);

        // Log in the user automatically after registration
        const loginResponse = await fetch('http://localhost:4000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: user.username, password: user.password })
        });
        const tokenJson = await loginResponse.json();

        if (loginResponse.ok) {
          dispatch({ type: 'SET_AUTH', payload: { user: json, token: tokenJson.token } });
          navigate('/Teams/' + json.username);
        } else {
          setError(tokenJson.error);
        }
      } else {
        setError(json.error);
      }
    } else {
      setError(emptyFields);
    }
  }

  return (
    <form id="register-form" onSubmit={handleSubmit}>
      <h3>Register</h3>

      <label>Username:</label>
      <input 
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <label>Email:</label>
      <input 
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password:</label>
      <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button>Create User</button>

      {error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}
    </form>
  )
};

export default RegisterForm;
