const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message: "Username or password missing"});
  }
  else if(isValid(username)){
    return res.status(400).json({message: "Username already exists"});
  }
  else{
    users[username] = password;
    return res.status(200).json({message: "Registration successful"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).json({book});
  }
  else{
    return res.status(400).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = [];
  for(let i in books){
    if(books[i].author == author){
      book.push(books[i]);
    }
  }
  if(book.length > 0){
    return res.status(200).json({book});
  }
  else{
    return res.status(400).json({message: "Books not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let book = [];
  for(let i in books){
    if(books[i].title == title){
      book.push(books[i]);
    }
  }
  if(book.length > 0){
    return res.status(200).json({book});
  }
  else{
    return res.status(400).json({message: "Books not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let review = [];
  for(let i in books){
    if(i == isbn){
      review.push(books[i].reviews);
    }
  }
  if(review.length > 0){
    return res.status(200).json({review});
  }
  else{
    return res.status(400).json({message: "Reviews not found"});
  }
});

module.exports.general = public_users;
