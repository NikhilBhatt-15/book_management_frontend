import React, { useState, useEffect,useCallback } from 'react';
import CustomModal from './CustomModal';
import { useNavigate } from 'react-router-dom';
import './Cart.css';


const Cart = ({ accessToken }) => {
  const [cartItems, setCartItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const removeFromCart = useCallback( async (book_id)=>{
    try {
      const response = await fetch('/api/user/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: book_id }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const status = await response.json();
        console.log('Cart item removed successfully', status);
        setCartItems(cartItems.filter(item => item.book_id != book_id));
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  },[cartItems,setCartItems]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/user/getcart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const fetchedCartItems = await response.json();
          console.log('Cart items fetched successfully', fetchedCartItems);
          setCartItems(fetchedCartItems);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
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
          const fetchedBooks = await response.json();
          console.log('Books fetched successfully', fetchedBooks);
          setBooks(fetchedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchCartItems();
    fetchBooks();
  }, [accessToken]);

  useEffect(()=>{
    console.log(cartItems);
  },[cartItems]);

  const handleQuantityChange = async (bookId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch('/api/user/updatecart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId, quantity }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const updatedItem = await response.json();
        console.log('Cart item updated successfully', updatedItem);
        setCartItems(cartItems.map(item => item.book_id === bookId ? updatedItem : item));
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRent = async (book_id) => {
    try {
      const response = await fetch(`/api/user/rent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: book_id }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const result = await response.json();
        console.log(`request send successful`, result);
        if(result.message){
          setModalMessage('Already Rented');
        }
        else{
        setModalMessage(`Rent Request Placed`);
        }
        setShowModal(true);
      }


    } catch (error) {
      console.error(`Error during Order:`, error);
    }
  };
  const handleBuy = async (book_id, quantity) => {
    try {
      const response = await fetch(`/api/user/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: book_id,quantity:quantity }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const result = await response.json();
        console.log(`order successful`, result);
        setModalMessage(` order placed successfully`);
        setShowModal(true);
      }


    } catch (error) {
      console.error(`Error during Order:`, error);
    }
  };

  const getBookDetails = (bookId) => {
    return books.find(book => book.id === bookId) || {};
  };

  const checkout=async()=>{
    try {
      const response  = await fetch('api/user/checkout',{
        method:'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if(!response.ok){
        console.log(response);
        setModalMessage("some Error occured Try again");
        setShowModal(true);
      }
      else{
        const result = await response.json();
        console.log(result);
        setModalMessage('Orders placed succesfully');
        setShowModal(true);
        setCartItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cartItems.length?(
        <table className="cart-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Rent Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const book = getBookDetails(item.book_id);
            return (
              <tr key={item.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>${book.price}</td>
                <td>${book.rent_price}</td>
                <td>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}>+</button>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleBuy(item.book_id, item.quantity)}>Buy </button>
                  <button onClick={() => handleRent(item.book_id)}>Rent</button>
                  <button onClick={()=> removeFromCart(item.book_id)}>Remove from Cart</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        
      </table>
      ):(
        <div className='cart-empty-container'>
        <h2>Cart is Empty</h2>
        <h3>Add items to Cart</h3>
        </div>
      )}
      
      <button className='checkout-btn' hidden={cartItems.length?false:true} onClick={()=> checkout()}>Proceed to checkout</button>
      <CustomModal show={showModal} onClose={() => setShowModal(false)} message={modalMessage} />

    </div>
  );
};

export default Cart;
