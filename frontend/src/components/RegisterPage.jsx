import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPlayer } from '../api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await registerPlayer(username, password);
      if (response && response.PlayerID) {
        localStorage.setItem('playerId', response.PlayerID);
        window.location.href = '/~samuel.stjean/Critter_Keeper/game';
      } else {
        setError('Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'transparent',
        padding: '20px'
      }}>
        <div style={{
          border: '20px solid #6a4a3a',
          borderRadius: '12px',
          padding: '20px 30px',
          marginBottom: '-4px',
          backgroundColor: '#6a4a3a'
        }}>
          <h1 style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '22px',
            color: '#f5e1c8',
            textAlign: 'center',
            margin: 0
          }}>
            Critter Keeper
          </h1>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          border: '3px solid #6a4a3a',
          borderRadius: '16px',
          marginBottom: '100px',
          backgroundColor: 'rgba(224, 211, 194, 0.9)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#6a4a3a'
          }}>
            Create a New Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username" style={{
                display: 'block',
                fontSize: '1.1em',
                color: '#6a4a3a',
                fontWeight: 'bold'
              }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  backgroundColor: '#f5e1c8',
                  border: '2px solid #6a4a3a',
                  borderRadius: '8px',
                  fontSize: '1em',
                  color: '#6a4a3a'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '1.1em',
                color: '#6a4a3a',
                fontWeight: 'bold'
              }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  backgroundColor: '#f5e1c8',
                  border: '2px solid #6a4a3a',
                  borderRadius: '8px',
                  fontSize: '1em',
                  color: '#6a4a3a'
                }}
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              backgroundColor: '#6a946a',
              color: '#fff9f2',
              border: '2px solid #4a6a4a',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '1.1em',
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Register
            </button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              marginTop: '15px',
              backgroundColor: 'transparent',
              color: '#6a4a3a',
              border: 'none',
              fontSize: '0.9em',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
