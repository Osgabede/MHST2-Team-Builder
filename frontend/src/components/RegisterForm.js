import { useState } from "react";
import { useUsersContext } from '../hooks/useUsersContext';

const RegisterForm = () => {
  const { dispatch } = useUsersContext();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {username, email, password};

    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setError(null);
      console.log('new user added', json);
      dispatch({type: 'CREATE_USER', payload: json});
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
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

      <button>Register</button>
    </form>
  )
};

export default RegisterForm;