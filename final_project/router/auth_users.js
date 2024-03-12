const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  // check if the username is already registered
  return users[username];
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users[username] === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message: "Username or password missing"});
  }
  else if(authenticatedUser(username, password)){
    //create a token
    let token = jwt.sign({username: username}, 'fingerprint_customer');
    req.session.token = token;
    return res.status(200).json({token: token});
  }
  else{
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
