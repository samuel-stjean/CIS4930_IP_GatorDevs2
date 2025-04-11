import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPlayer } from '../api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('playerId'); // ✅ Clear old session
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginPlayer(username, password);
      if (response && response.PlayerID) {
        localStorage.setItem('playerId', response.PlayerID);
        window.location.href = '/~samuel.stjean/Critter_Keeper/game';
      } else {
        setError('Invalid login.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="button" onClick={() => navigate('/register')}>
        Don't have an account? Register
    </button>

    </div>
  );
};

export default LoginPage;
