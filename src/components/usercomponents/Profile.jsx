import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ accessToken }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    address:'',
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const fetchedUser = await response.json();
          console.log('User profile fetched successfully', fetchedUser);
          setUser(fetchedUser);
          setEditedUser(fetchedUser);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
      const response = await fetch('/api/user/updateprofile', {
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
        console.log('User profile updated successfully', updatedUser);
        setUser(updatedUser);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const logout= async()=>{
    try {
      const response = fetch('/api/user/logout',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

        localStorage.removeItem("accessToken");
        navigate('/user/login');

    } catch (error) {
      
    }
  }

  return (
    <div className='profile-wrapper'>
      <div className="profile-container">
      <h2>Profile</h2>
      {editMode ? (
        <div className="profile-form">
          <label>
            Name:
            <input type="text" name="name" value={editedUser.name} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
          </label>
          <label>
            address:
            <input type="text" name="address" value={editedUser.address} onChange={handleChange} />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-info">
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

export default Profile;
