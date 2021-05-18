const express = require('express');
const router = express.Router();
const bookController = require('../controller/book.controller')

router.route('/books')
.get(bookController.getAllBooks)

router.route('/book/:id')
.get(bookController.getBookById)
.pos

module.exports = router