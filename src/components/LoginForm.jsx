import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginform.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginForm = () => {
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
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage( 'Invalid credentials');
        setShowMessage(true);
        return;
      }

      const result = await response.json();
      console.log('Success:', result);
      setEmail('');
      setPassword('');
      const access = result.access_token;
      localStorage.setItem('accessToken', access);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error');
      setShowMessage(true);
    }
  };

  return (
    <div className="logincontainer">
      <div className="logincard">
        <div className="logincard_title">
          <h1>Log in</h1>
          <span>Doesn't have an account? <a href="http://localhost:5173/user/signup">Sign up</a></span>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            <button type="submit">Log in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
