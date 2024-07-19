import React, { useState, useEffect,useCallback } from 'react';

import './Rented.css';


const Rented = ({ accessToken }) => {
  const [requestItems, setRequestItems] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchRequestItems = async () => {
      try {
        const response = await fetch('/api/user/rentrequests', {
          method: 'POST',
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


      const fetchBooks = async () => {
        try {
          const response = await fetch('/api/user/getbooks', {
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
    fetchRequestItems();
  }, [accessToken]);

  const handleRequest = async (book_id) => {
    try {
      const response = await fetch('/api/user/returnbook', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id:book_id, }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const updatedItem = await response.json();
        console.log('Returned successfully', updatedItem);
        setRequestItems(requestItems.map(item => {
            if(item.book_id == book_id){
                item.returned = 1;
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
        const response = await fetch('/api/user/removerequest', {
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

  return (
    <div className="rent-container">
      <h2>Rent Requests</h2>
      <table className="rent-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Status</th>
            <th>Returned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requestItems.map((item) => {
            const book = getBookDetails(item.book_id);
            return (
              <tr key={item.id}>
                <td>{book.title}</td>
                <td>{item.status}</td>
                <td>{item.returned?'Returned':'Not Returned'}</td>
                <td>
                  <div className={(item.status=="approved" && !item.returned)?"rent-return-btn":"rent-remove-btn"}>
                    <button onClick={() => (item.status=="approved" && !item.returned)?handleRequest(book.id):removeRequest(item.id)}>{item.status=="approved"&& !item.returned?"Return":"Remove"}</button>
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

export default Rented;
