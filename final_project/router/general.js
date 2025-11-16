const express = require('express');
let books = require("./booksdb.js")
const public_users = express.Router();

// ----------------------
// Task 10: Get all books (async/await)
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books found");
        });
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// ----------------------
// Task 11: Get book by ISBN (async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// ----------------------
// Task 12: Get books by author (async/await)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.author.toLowerCase() === author
            );
            if (result.length > 0) resolve(result);
            else reject("No books found for this author");
        });
        res.status(200).json(filteredBooks);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// ----------------------
// Task 13: Get books by title (async/await)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const filteredBooks = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.title.toLowerCase() === title
            );
            if (result.length > 0) resolve(result);
            else reject("No books found with this title");
        });
        res.status(200).json(filteredBooks);
    } catch (err) {
        res.status(404).json({ message: err });
    }
})
module.exports.general = public_users;
