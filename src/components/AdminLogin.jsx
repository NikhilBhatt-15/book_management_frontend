import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminlogin.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
        setErrorMessage( 'Invalid credentials');
        setShowMessage(true);
        return;
      }

      const result = await response.json();
      console.log('Success:', result);
      setEmail("");
      setPassword("");
      const access = result.access_token;
      localStorage.setItem("adminAccessToken", access);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error');
      setShowMessage(true);
    }
  };


  return (
    <>
    <div className="admin-container">
    <div className="admin-card">
      <div className="admin-card_title">
        <h1>Admin Login</h1>
        <span>Doesn't have an account? <a href="http://localhost:5173/user/signup">Sign up</a></span>
      </div>
      <div className="form">
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" id="email" value={email}  onChange={(e) => setEmail(e.target.value)} required/>
        <div className="password-container">
              <input
                type={hidden ? 'password' : 'text'}
                name="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setHidden(!hidden)}
              >
                {hidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {showMessage && <p className="error-message">{errorMessage}</p>}
        <button type='submit'>Log in</button>
        </form>
      </div>
    </div>
  </div>
  </>
  );
};

export default AdminLoginForm;
