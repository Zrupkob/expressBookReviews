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
public_users.get('/', async function (req, res) {
    const url = 'http://localhost:5000/books';
        try {
            const response = await axios.get(url);
            res.json(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data: ', error);
            res.status(500).json({ message: 'Error fetching data' });
        }
});

public_users.get('/books', function (req, res) {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const url = 'http://localhost:5000/books'
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(url);
        fetchedData = response.data;
        filteredData = fetchedData[isbn];
        res.send(filteredData);
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const url = 'http://localhost:5000/books'
    try {
        const author = req.params.author;
        const response = await axios.get(url);
        fetchedData = response.data;
        filteredData = Object.values(fetchedData).filter((book) => book.author === author);
        res.send(filteredData);
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const url = 'http://localhost:5000/books'
    try {
        const title = req.params.title;
        const response = await axios.get(url);
        fetchedData = response.data;
        filteredData = Object.values(fetchedData).filter((book) => book.title === title);
        res.send(filteredData);
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
