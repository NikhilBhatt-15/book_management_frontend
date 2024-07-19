import React from 'react';
import './DashboardSidebar.css'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// Define the Sidebar component
const DashboardSidebar = ({ name,email,onSelect }) => {
  return (
    <div className="sidebar">
      <div className="admin-info">
        <h2 className="admin-name">{name}</h2>
        <p className="admin-email">{email}</p>
      </div>
      <ul className="menu">
        <li className="menuItem" onClick={() => onSelect('dashboard')}>
          <DashboardIcon className="icon" /> Dashboard
        </li>
        <li className="menuItem" onClick={() => onSelect('member')}>
          <PersonIcon className="icon" /> Member
        </li>
        <li className="menuItem" onClick={() => onSelect('addBooks')}>
          <BookIcon className="icon" /> Add Books
        </li>
        <li className="menuItem" onClick={() => onSelect('orders')}>
          <ShoppingCartIcon className="icon" /> Orders
        </li>
        <li className="menuItem" onClick={() => onSelect('requests')}>
          <MailIcon className="icon" /> Requests
        </li>
        <li className="menuItem" onClick={() => onSelect('profile')}>
          <AccountCircleIcon className="icon" /> Profile
        </li>
      </ul>
    </div>
  );
};


export default DashboardSidebar;