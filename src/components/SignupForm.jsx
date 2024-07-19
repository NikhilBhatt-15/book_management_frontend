import React, { useState } from 'react';
import './signupform.css';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [hidden, setHidden] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
      address,
    };

    try {
      const response = await fetch('/api/user/register', {
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
      }

      const result = await response.json();
      console.log('Success:', result);
      navigate('/user/login');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error');
      setShowMessage(true);
    }
  };


  return (
    <div className="container">
    <div className="card">
      <div className="card_title">
        <h1>Create Account</h1>
        <span>Already have an account? <a href="http://localhost:5173/user/login">Login</a></span>
      </div>
      <div className="form">
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder="UserName" value={name}  onChange={(e) => setName(e.target.value)} required />
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
        <input type="text" name="address" value={address} placeholder='Address' onChange={(e) => setAddress(e.target.value)} required />
        <button type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default SignupForm;
