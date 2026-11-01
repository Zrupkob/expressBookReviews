const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can log in."});
      } else {
          return res.status(404).json({message: "Unable to register user. User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user. The username and/or password is missing."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    let getAllBooksPromise = new Promise((resolve,reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)))})

    //Call the promise, wait for it to be resolved and then print a message.
    getAllBooksPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        console.log("Promise resolved");
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Extract the author parameter from the request URL
  const author = req.params.author;
  // Filter the books array to find books whose author matches the extracted author parameter - NOTE: books is an object and has to be filtered differently
  let filtered_author = Object.values(books).filter((book) => book.author === author);
  // Send the filtered_author array as the response to the client
  res.send(filtered_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Extract the title parameter from the request URL
  const title = req.params.title;
  // Filter the books array to find books whose title matches the extracted title parameter - NOTE: books is an object and has to be filtered differently
  let filtered_title = Object.values(books).filter((book) => book.title === title);
  // Send the filtered_title array as the response to the client
  res.send(filtered_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
