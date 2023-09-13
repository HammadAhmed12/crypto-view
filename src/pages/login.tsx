import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/auth/isValid`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          navigate('/dashboard');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && password && emailRegex.test(email) && password.length >= 5) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
          email: email,
          password: password,
        });

        if (response?.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          navigate('/dashboard');
        } else {
          setError('Email and/or password incorrect');
        }
      } catch (error) {
        console.error('Error during login:', error);
        //@ts-ignore
        alert(error.message||'An error occurred during login');
      }
    } else {
      setError('Please enter a valid email and a password with at least 6 characters');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Login</h2>
      </div>
      {error && <div className="error-message">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="submit-btn" onClick={handleLogin} disabled={!email || !password}>
        Login
      </button>
      <a href="/signup" className="signup-link">
        Don't have an account? Sign up here
      </a>
    </div>
  );
};

export default Login;
