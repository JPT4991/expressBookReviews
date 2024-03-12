const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username or password missing' });
  } else if (isValid(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  } else {
    users[username] = password;
    return res.status(200).json({ message: 'Registration successful' });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      resolve(res.status(200).json(books));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    await new Promise((resolve, reject) => {
      resolve(res.status(200).json(books[isbn]));
      reject(res.status(400).json({ message: 'Book not found' }));
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
    const booksByAuthor = [];
    await new Promise((resolve, reject) => {
      for (let i in books) {
        if (books[i].author == author) {
          booksByAuthor.push(books[i]);
        }
      }
      if (booksByAuthor.length > 0) {
        resolve(res.status(200).json({ booksByAuthor }));
      } else {
        reject(res.status(400).json({ message: 'Books not found' }));
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  let booksByTitle = [];
  try {
    await new Promise((resolve, reject) => {
      for (let i in books) {
        if (books[i].title == title) {
          booksByTitle.push(books[i]);
        }
      }
      if (booksByTitle.length > 0) {
        resolve(res.status(200).json({ booksByTitle }));
      } else {
        reject(res.status(400).json({ message: 'Books not found' }));
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let review = [];
  for (let i in books) {
    if (i == isbn) {
      review.push(books[i].reviews);
    }
  }
  if (review.length > 0) {
    return res.status(200).json({ review });
  } else {
    return res.status(400).json({ message: 'Reviews not found' });
  }
});

module.exports.general = public_users;
