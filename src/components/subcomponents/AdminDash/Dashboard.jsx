import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import InfoCard from '../infocard/InfoCard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import './Dashboard.css'
const Dashboard = ()=>{
    const [books,setBooks] = useState();
    const [users,setUsers] = useState();
    const [orders,setOrders] = useState();
    const [requests,setRequests] = useState();
    const access_token = localStorage.getItem('adminAccessToken');

    useEffect(()=>{
        (async()=>{
            try {
                const response = await fetch('/api/admin/getbooks',{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });
        
                if(!response.ok){
                    console.log(response);
                }
                else{
                     const rbooks = await response.json();
                     console.log("Success",rbooks)
                     setBooks(rbooks.length);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            try {
                const response = await fetch('/api/admin/getusers',{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });
        
                if(!response.ok){
                    console.log(response);
                }
                else{
                     const rusers = await response.json();
                     console.log("Success",rusers)
                     setUsers(rusers.length);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            try {
                const response = await fetch('/api/admin/getrequests',{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });
        
                if(false){
                    console.log(response);
                }
                else{
                     const rrequests = await response.json();
                     console.log("Success",rrequests)
                     setRequests(rrequests.length);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            try {
                const response = await fetch('/api/admin/getorders',{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });
        
                if(!response.ok){
                    console.log(response);
                }
                else{
                     const rorders = await response.json();
                     console.log("Success",rorders)
                     setOrders(rorders.length);
                }
            } catch (error) {
                console.error('Error:', error);
            }        
        })();
    },[access_token]);


    return (
        <div className="wrapper">
        <InfoCard label="Books" count={books ?? 'Loading..'} icon={<LibraryBooksIcon/>}/>
        <InfoCard label="Users" count={users ?? 'Loading..'} icon={<PeopleIcon/>}/>
        <InfoCard label="Orders" count={orders ?? 'Loading..'} icon={<LocalShippingIcon/>}/>
        <InfoCard label="Requests" count={requests ?? 'Loading..'} icon={<NewReleasesIcon/>}/>
        </div>
    )

}

export default Dashboard;