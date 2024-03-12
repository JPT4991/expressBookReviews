const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // check if the username is already registered
  return users[username];
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users[username] === password;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username or password missing' });
  } else if (authenticatedUser(username, password)) {
    //create a token
    let token = jwt.sign({ username: username }, 'fingerprint_customer');
    req.session.token = token;
    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add a book review
regd_users.post('/auth/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let rating = req.body.rating;
  let username = req.session.user.username;
  if (!review || !rating) {
    return res.status(400).json({ message: 'Review or rating missing' });
  }
  if (!books[isbn]) {
    return res.status(400).json({ message: 'Book not found' });
  }

  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = { review: review, rating: rating };
    return res.status(200).json({ message: 'Review updated successfully' });
  }

  books[isbn].reviews[username] = { review: review, rating: rating };
  return res.status(200).json({ message: 'Review added successfully' });
});

// delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.user.username;
  if (!books[isbn]) {
    return res.status(400).json({ message: 'Book not found' });
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' });
  }
  return res.status(400).json({ message: 'Review not found' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
