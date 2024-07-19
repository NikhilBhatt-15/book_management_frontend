import React, { useState, useEffect } from 'react';
import CustomModal from './CustomModal';
import './Book.css';

const Book = ({ accessToken }) => {
  const [books, setBooks] = useState([]);
  const [categories,setCategories] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  useEffect(() => {
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
          const initialQuantity = fetchedBooks.reduce((acc, book) => {
            acc[book.id] = 1;
            return acc;
          }, {});
          setQuantity(initialQuantity);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/user/getcategories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const rcategories = await response.json();
          console.log('Categories fetched successfully', rcategories);
          setCategories(rcategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
    fetchBooks();
  }, [accessToken]);

  const handleQuantityChange = (bookId, value) => {
    setQuantity({
      ...quantity,
      [bookId]: parseInt(value, 10),
    });
  };

  const getCategory = (category_id) => {
    const category = categories.find((categoryy) => categoryy.id == category_id);
    console.log(category);
    return category ? category.title : 'Unknown User';
  };
  const handleAddToCart = async (bookId) => {
    const bookQuantity = quantity[bookId];
    try {
      const response = await fetch('/api/user/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId, quantity: bookQuantity }),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const result = await response.json();
        console.log('Book added to cart successfully', result);
        setModalMessage(` Added to Cart `);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  return (
    <div className="books-container">
      <h2>Books</h2>
      <div className="books-list">
        {books.filter(book=> book.quantity>0).map((book) => (
          (<div key={book.id} className="book-item">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <p>Rent Price: ${book.rent_price}</p>
            <p>Quantity: {book.quantity}</p>
            <p>Category: {getCategory(book.category_id)}</p>
            <div className="add-to-cart">  
              <input
                type="number"
                value={quantity[book.id]}
                min="1"
                max={book.quantity}
                onChange={(e) => handleQuantityChange(book.id, e.target.value)}
              />
              <button onClick={() => handleAddToCart(book.id)}>Add to Cart</button>
            </div>
          </div>)
        ))}
      </div>
      <CustomModal show={showModal} onClose={() => setShowModal(false)} message={modalMessage} />

    </div>
  );
};

export default Book;
