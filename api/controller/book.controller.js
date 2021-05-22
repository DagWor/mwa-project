const Book = require('../data/book.model')

module.exports.getAllBooks = (req, res) => {
    let offset = 0
    let count = 5

    let maxCount = 10;

    if (req.query && req.query.offset) offset = parseInt(req.query.offset);
    if (req.query && req.query.count) count = parseInt(req.query.count);

    if (isNaN(offset) || isNaN(count)) res.status(400).json({ 'message': 'Query String offset and count should be numbers' });

    if (count > maxCount) res.status(400).json({ 'message': 'Count can not be greater than ' + maxCount });

    Book.find().exec((err, books) => {
        const response = {
            status: 200,
            message: books
        }

        if (err) {
            response.status = 500
            response.message = 'Server Issues'
        }
        else if (!books) {
            response.message = 'No books found'
        } else {
            response.message = books.slice(offset, count)

        }

        res.status(response.status).json(response.message)
    })
}

module.exports.getBookById = (req, res) => {
    const response = {
        status: 200,
        message: ""
    }

    Book.findById(req.params.id).exec((err, book) => {
        if (err) {
            response.status = 500
            response.message = 'Invalid ID provided'
        } else if (!book) {
            response.status = 404
            response.message = 'Book not found'
        } else if (book) {
            response.message = book
        }
        res.status(response.status).json(response.message)
    })
}

module.exports.addOneBook = (req, res) => {
    const response = {
        status: 201,
        message: ""
    }
    if (req.body && req.body.title && req.body.year && req.body.edition && req.body.author) {
        const newBook = {};
        newBook.title = req.body.title
        newBook.year = `${new Date(req.body.year).getFullYear()}`
        newBook.edition = req.body.edition;
        newBook.author = req.body.author;

        Book.create(newBook, (err, student) => {
            if (err) {
                response.status = 500;
                response.message = err
            } else response.message = student

            res.status(response.status).json(response.message);
        })
    } else {
        response.status = 400;
        response.message = 'Insufficient information'

        res.status(response.status).json(response.message);
    }
}

module.exports.updateOneBook = (req, res) => {
    if (req.params.id) {
        Book.findById(req.params.id).exec((err, book) => {
            const response = {
                status: 201,
                message: book
            }

            if (err) {
                response.status = 500
                response.message = 'Internal Server Error'
            }
            else if (!book) {
                response.status = 404
                response.message = 'book not found'
            }
            if (response.status !== 201) {
                res.status(response.status).json(response.message)
                return;
            }

            else if (req.body && req.body.title && req.body.edition && req.body.author && req.body.year) {

                book.title = req.body.title
                book.edition = req.body.edition
                book.author = req.body.author
                book.year = req.body.year

                book.save((err, updatedbook) => {
                    if (err) {
                        response.status = 500
                        response.message = err
                    } else {
                        response.message = updatedbook
                    }
                    res.status(response.status).json(response.message)
                })
            } else {
                response.status = 400
                response.message = 'missing information'
                res.status(response.status).json(response.message)
            }

        });
    }
}

module.exports.patchOneBook = (req, res) => {
    if (req.params.id) {
        Book.findById(req.params.id).exec((err, book) => {
            const response = {
                status: 201,
                message: book
            }

            if (err) res.status(500).json({ 'message': 'book not found' })
            else if (!book) {
                response.status = 404
                response.message = 'book not found'
            }
            if (response.status !== 201) res.status(response.status).json(response.message)

            else {
                if (req.body.title) book.title = req.body.title
                if (req.body.year) book.year = req.body.year
                if (req.body.edition) book.edition = req.body.edition
                if (req.body.author) book.author = req.body.author

                book.save((err, updatedbook) => {
                    if (err) {
                        response.status = 500
                        response.message = err
                    } else {
                        response.message = updatedbook
                    }

                    res.status(response.status).json(response.message)
                })
            }

        });
    }
}


module.exports.deleteOneBook = (req, res) => {
    Book.findByIdAndDelete(req.params.id, (err, book) => {
        let response = {
            status: 204,
            message: ""
        }
        if (err) {
            response.status = 500
            response.message = "Internal Server Error"
        } else if (!book) {
            response.status = 404
            response.message = "book not found in database"
        } else {
            response.status = 204
            response.message = "book Deleted Successfully"
        }

        res.status(response.status).json({ 'message': response.message })
    })

}

