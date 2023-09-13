import React, { useState } from 'react';
import '../styles/login.css'; // Make sure to adjust the path
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
        }),
      });

      if (response.ok) {
        alert('Signup successful!');
        navigate('/login')
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    } catch (error) {
      //@ts-ignore
      alert(error.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Signup</h2>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="input-wrapper">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input-field"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="input-wrapper">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="input-wrapper">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      <div className="input-wrapper">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="input-field"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>
      <button type="submit" className="submit-btn" onClick={handleSignup} disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword}>
        Signup
      </button>
      <a href="/login" className="login-link">Already have an account? Login here</a>
    </div>
  );
};

export default Signup;
