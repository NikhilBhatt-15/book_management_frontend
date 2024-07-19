import React, { useState, useEffect ,useCallback} from 'react';
import './AddBook.css';

const AddBook = ({ accessToken }) => {
  const [books, setBooks] = useState([]);
  const [editmode,setEditmode] = useState(false);
  const [editbook_id,seteditbook_id] = useState();
  const [categories, setCategories] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    rent_price: '',
    quantity: '',
    category_id:'' ,
  });
  
  

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setNewBook({
      ...newBook,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleAddBook = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/addbook', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        console.log(response);
      } else {
        const addedBook = await response.json();
        console.log('Book added successfully', addedBook);
        setBooks([...books, addedBook]);
        setNewBook({
          title: '',
          author: '',
          price: '',
          rent_price: '',
          quantity: '',
          category_id: '',
        });
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  },[accessToken,books,newBook]);

  const handleDeleteBook = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/admin/deletebook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "id":id
        })
      });

      if (!response.ok) {
        console.log(response);
      } else {
        console.log('Book deleted successfully');
        setBooks(books.filter((book) => book.id !== id));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  },[books]);

  const editBook = (ebook)=>{
    
    let book = {
          title: ebook.title,
          author: ebook.author,
          price: ebook.price,
          rent_price: ebook.rent_price,
          quantity: ebook.quantity,
          category_id: ebook.category_id,
    }
    setNewBook(book);
    setEditmode(true);
    seteditbook_id(ebook.id);
  }
  const handleEditBook = useCallback(async () => {

    try {
      const response = await fetch(`/api/admin/modifybook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "book_id":editbook_id,
            "title": newBook.title,
            "author": newBook.author,
            "price": newBook.price,
            "rent_price": newBook.rent_price,
            "quantity": newBook.quantity,
            "category_id": newBook.category_id,
        })
      });

      if (!response.ok) {
        console.log(response);
        window.alert('Try again');
      } else {
        console.log('Book Edited successfully');
        setNewBook(
          {
            title: '',
            author: '',
            price: '',
            rent_price: '',
            quantity: '',
            category_id: '',
          }
        );
        // setBooks(books.filter((book) => book.id !== id));
        setEditmode(false);
      }
    } catch (error) {
      console.error('Error in Editing book:', error);
    }
    
  },[editbook_id,editmode,newBook,books]);

  useEffect(() => {
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

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/getcategories', {
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

    fetchBooks();
    fetchCategories();
  }, [accessToken],handleAddBook,handleDeleteBook,handleEditBook);


  useEffect(() => {
    console.log('New book state updated:', newBook);
  }, [newBook]);

  const getCategory = (category_id)=>{
    const $categoryName =  categories.find(($item)=> 
      $item.id ==category_id
);
    return $categoryName?$categoryName.title:"Other";
  }
  return (
    <div className="add-book-container">
      <h2>{editmode?'Edit Book':'Add Book'}</h2>
      <div className="book-form-group">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newBook.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rent_price"
          placeholder="Rent Price"
          value={newBook.rent_price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newBook.quantity}
          onChange={handleChange}
        />
        <select name="category_id" value={newBook.category_id} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <button onClick={editmode?handleEditBook:handleAddBook}>{editmode?'Edit Book':'Add Book'}</button>
      </div>
      <div className="book-list">
        <h3>Book List</h3>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <span>{book.title} by {book.author} - ${book.price} (Rent: ${book.rent_price}) - Qty: {book.quantity} - Category: {getCategory(book.category_id)}</span>
              <span><button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddBook;
