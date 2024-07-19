import React, { useState, useEffect } from 'react';
import './OrderDisplay.css';

const OrderDisplay = ({ accessToken, }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/getorders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log('Error fetching orders:', response);
        } else {
          const rorders = await response.json();
          console.log('Orders fetched successfully:', rorders);
          setOrders(rorders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
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
          console.log('Error fetching books:', response);
        } else {
          const rbooks = await response.json();
          console.log('Books fetched successfully:', rbooks);
          setBooks(rbooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchOrders();
    fetchUsers();
    fetchBooks();
  }, [accessToken]);

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getBookName = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  return (
    <div className="order-display-container">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Book Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{getUserName(order.user_id)}</td>
              <td>{getBookName(order.book_id)}</td>
              <td>${order.amount}</td>
              <td>{order.quantity}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDisplay;
