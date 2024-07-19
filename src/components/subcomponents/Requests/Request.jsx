import React, { useState, useEffect,useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import './Request.css';


const Requests = ({ accessToken }) => {
  const [requestItems, setRequestItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [users,setUsers] = useState([]);



 
  useEffect(() => {
    const fetchRequestItems = async () => {
      try {
        const response = await fetch('/api/admin/getrequests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const fetchedRequestItems = await response.json();
          console.log('Request items fetched successfully', fetchedRequestItems);
          setRequestItems(fetchedRequestItems);
        }
      } catch (error) {
        console.error('Error fetching Request items:', error);
      }
    };

    const fetchUsers = async () => {
        try {
          const response = await fetch('/api/admin/getusers', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            console.log('Error fetching users:', response);
          } else {
            const rusers = await response.json();
            console.log('Users fetched successfully:', rusers);
            setUsers(rusers);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      const fetchBooks = async () => {
        try {
          const response = await fetch('/api/admin/getbooks', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            console.log(response);
          } else {
            const rbooks = await response.json();
            console.log('Books fetched successfully', rbooks);
            setBooks(rbooks);
          }
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };
      fetchBooks();
     fetchUsers(); 
    fetchRequestItems();
  }, [accessToken]);

  const handleRequest = async (request_id,action) => {


    try {
      const response = await fetch('/api/admin/handlerequests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rent_request_id:request_id, status:action }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const updatedItem = await response.json();
        console.log('Resquest ${action} successfully', updatedItem);
        setRequestItems(requestItems.map(item => {
            if(item.id===request_id){
                item.status = action;
            }
            return item;
        }));
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };
 
  const removeRequest = async (item_id)=>{
    try {
        const response = await fetch('/api/admin/removerequest', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_id:item_id }),
        });
  
        if (!response.ok) {
          console.log(response);
        } else {
          const result = await response.json();
          console.log('Removed successfully', result);
          setRequestItems(requestItems.filter((item) => item.id!=item_id));
        }
      } catch (error) {
        console.error('Error removing request:', error);
      }
  };

  const getBookDetails = (bookId) => {
    return books.find(book => book.id === bookId) || {};
  };
  const getUserDetails = (userid) =>{
    return users.find(users=> users.id=== userid) || {};
  }

  return (
    <div className="request-container">
      <h2>Book Rent Request</h2>
      <table className="request-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Status</th>
            <th>Returned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requestItems.map((item) => {
            const book = getBookDetails(item.book_id);
            const user = getUserDetails(item.user_id);
            return (
              <tr key={item.id}>
                <td>{user.name}</td>
                <td>{book.title}</td>
                <td>{item.status}</td>
                <td>{item.returned?'Returned':'Not Returned'}</td>
                <td>
                
                  <div className="request-control">
                    {!item.returned?(
                      <>
                      <button onClick={() => handleRequest(item.id, 'approved')}>Approve</button>
                      <button onClick={() => handleRequest(item.id, 'rejected')} >Reject</button>
                      </>
                    ):(
                      <button className="request-delete-btn" onClick={()=>removeRequest(item.id)}>{<DeleteIcon/>}</button>
                    )}
                    
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>


    </div>
  );
};

export default Requests;
