import  { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from './subcomponents/Sidebar/DashboardSideBar';
import Dashboard from './subcomponents/AdminDash/Dashboard';
import AddBook from './subcomponents/Books/AddBook';
import OrderDisplay from './subcomponents/Orders/OrderDisplay';
import UserList from './subcomponents/Users/UserList';
import Profile from './subcomponents/Profile/Profile';
import Requests from './subcomponents/Requests/Request';


function AdminDashboard(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    
    const navigate = useNavigate();
    const access_token = localStorage.getItem('adminAccessToken');

    const [selectedOption, setSelectedOption] = useState('dashboard');
    
    const handleSelect = (option) => {
        setSelectedOption(option);
      };

      useEffect(()=>{
        async function getProfile(){
          try {
              const response = await fetch('/api/admin/profile', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
                
              });
        
              if (!response.ok) {
                navigate('/admin/login');
                throw new Error('Network response was not ok');
              }
        
              const result = await response.json();
              console.log('Success:', result);
              let n = result.name;
              n.toUpperCase();
              setName(n);
              setEmail(result.email);
              
            } catch (error) {
              console.error('Error:', error);
            }
      }
      getProfile();
      },[access_token]);
      
    return (
      <div style={styles.dashboard}>
        <DashboardSidebar onSelect={handleSelect}  name={name} email={email} />
        <div style={styles.content}>
          {selectedOption === 'dashboard' && <Dashboard/>}
          {selectedOption === 'member' && <UserList accessToken={access_token}/>}
          {selectedOption === 'addBooks' && <AddBook accessToken={access_token}/>}
          {selectedOption === 'orders' && <OrderDisplay accessToken={access_token}/>}
          {selectedOption === 'requests' && <Requests accessToken={access_token}/>}
          {selectedOption === 'profile' && <Profile accessToken={access_token}/>}
        </div>
      </div>
    );
}
const styles = {
  dashboard: {
    display: 'flex'
  },
  content: {
    flex: 1,
    padding: '20px'
  }
};
export default AdminDashboard;