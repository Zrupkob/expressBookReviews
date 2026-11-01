const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Username and/or password is missing." });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in.");
    } else {
        return res.status(208).json({ message: "Invalid Login. Please check username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn; // Extract isbn parameter from request URL
    const postingusername = req.session.authorization.username; // Retrieve username from session
    let book = books[isbn];  // Retrieve book object associated with isbn
    let reviewtext = req.query.review; // Retrieve review text from query

    if (book) {  // Check if book exists

        // Update review if provided in request query
        if (postingusername && reviewtext) {
            book.reviews[postingusername] = reviewtext;
            books[isbn] = book;  // Update book details in 'books' object
            res.send(`Book reviews with isbn ${isbn} updated.`);
        } else {
            // Respond if user or review text is not found
            res.send("No review text or no username found!");
        }
    } else {
        // Respond if book with specified isbn is not found
        res.send("Unable to find book!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
