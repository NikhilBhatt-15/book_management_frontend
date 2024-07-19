


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Home from './usercomponents/Home';
import Book from './usercomponents/Book';
import Orders from './usercomponents/Orders';
import Rented from './usercomponents/Rented';
import Profile from './usercomponents/Profile';
import Cart from './usercomponents/Cart';
import './HomePage.css';


const HomePage = () => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [address,setAddress] = useState("");
  const navigate = useNavigate();
  const access_token = localStorage.getItem('accessToken');
  const [currentSection, setCurrentSection] = useState('home');
  const [anchorEl, setAnchorEl] = useState(null);

  ;(async ()=>{
                try {
                    const response = await fetch('/api/user/profile', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                      },
                      
                    });
              
                    if (!response.ok) {
                      navigate('/user/login');
                      throw new Error('Network response was not ok');
                    }
              
                    const result = await response.json();
                    console.log('Success:', result);
                    setName(result.name);
                    setEmail(result.email);
                    setAddress(result.address);
                    
                  } catch (error) {
                    console.error('Error:', error);
                  }
            })()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function shopnow(){
    setCurrentSection('books');
  }
  
  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home shopnow={shopnow}/>;
      case 'books':
        return <Book accessToken={access_token}/> ;
      case 'orders':
        return <Orders accessToken={access_token}/>;
      case 'profile':
        return <Profile accessToken={access_token}/>;
      case 'cart':
        return <Cart accessToken={access_token}/>;
      case 'rent':
        return <Rented accessToken={access_token}/>;
      default:
        return <h1>HOME</h1>;
    }
  };

  return (
    <div>
      <AppBar position="static"  style={{ backgroundColor: '#5d4037' }} className="navbar">
        <Toolbar>
          <Typography variant="h6" className="navbar-title" onClick={() => setCurrentSection('home')}>
            Book Store
          </Typography>
          <div className="navbar-links">
            <Button color="inherit" onClick={() => setCurrentSection('home')}>Home</Button>
            <Button color="inherit" onClick={() => setCurrentSection('books')}>Books</Button>
            <Button color="inherit" onClick={() => setCurrentSection('orders')}>Orders</Button>
            <Button color="inherit" onClick={() => setCurrentSection('profile')}>Profile</Button>
            <Button color="inherit" onClick={() => setCurrentSection('rent')}>Rented Books</Button>
          </div>
          <div className="navbar-icons">
            <IconButton color="inherit" onClick={()=> setCurrentSection('cart')}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>{name}</MenuItem>
              <MenuItem>{email}</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div className="section-container">
        {renderSection()}
      </div>
    </div>
  );
};

export default HomePage;
