import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle manual login
  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      window.location.reload();
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    localStorage.setItem('token', token);
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>

      {/* Manual Login Form */}
      <form onSubmit={handleManualLogin}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      {/* Google Login */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Google Login Failed')}
      />
    </div>
  );
}

export default Login;
