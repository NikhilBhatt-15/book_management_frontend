import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const AdminProfile = ({ accessToken }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const fetchedAdmin = await response.json();
          console.log('Admin profile fetched successfully', fetchedAdmin);
          setUser(fetchedAdmin);
          setEditedUser(fetchedAdmin);
        }
      } catch (error) {
        console.error('Error fetching Admin profile:', error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/updateprofile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const updatedUser = await response.json();
        console.log('Admin profile updated successfully', updatedUser);
        setUser(updatedUser);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const logout= async()=>{
    try {
      const response = fetch('/api/admin/logout',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      
        localStorage.removeItem("adminAccessToken");
        navigate('/admin/login');

    } catch (error) {
      
    }
  }

  return (
    <div className='adminprofile-wrapper'>
      <div className="adminprofile-container">
      <h2>Profile</h2>
      {editMode ? (
        <div className="adminprofile-form">
          <label>
            Name:
            <input type="text" name="name" value={editedUser.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="adminprofile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminProfile;
