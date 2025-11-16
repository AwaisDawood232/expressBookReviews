const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require("./users.js"); // shared users

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Check username + password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// LOGIN ROUTE
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
        req.session.authorization = { accessToken: token, username }; // store correct session

        return res.status(200).json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid login credentials" });
    }
});

// ADD OR MODIFY A BOOK REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", book: books[isbn] });
});

// DELETE A BOOK REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted" });
    } else {
        return res.status(404).json({ message: "No review by this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
