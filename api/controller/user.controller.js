const Book = require('../data/book.model')

const _addAuthor = (req, res, book, response) => {
    book.author.name = req.body.name;
    if (req.body.rating) book.author.rating = req.body.rating
    book.save((err, updatedBook) => {
        if (err) {
            response.status = 500;
            response.message = err;
        } else response.message = updatedBook

        res.status(response.status).json(response.message)
    })
}

module.exports.addOneAuthor = (req, res) => {
    Book.findById(req.params.id).exec((err, book) => {
        const response = {
            status: 201,
            message: book
        }

        if (err) {
            reqponse.status = 500;
            response.message = err;
        } else if (!book) {
            response.status = 404;
            response.message = 'book not found'
        }

        if (book) _addAuthor(req, res, book, response);
        else res.status(response.status).json(response.message);
    })
}

module.exports.getBookAuthor = (req, res) => {
    Book.findById(req.params.id).exec((err, book) => {
        const response = {
            status: 200,
            message: book
        }

        if (err) {
            response.status = 500
            response.message = 'Internal Server Error'
        }

        if (!book) response.message = 'Book not found'

        if (book.author) response.message = book.author
        else response.message = 'Author not found'

        res.status(response.status).json(response.message)
    });
}

module.exports.deleteOneAuthor = (req, res) => {
    const response = {
        status: 204,
        message: "Deleted author"
    }
    Book.findById(req.params.id).exec((err, book) => {
        if (err) {
            response.satus = 500
            response.message = 'Internal Server Error'
        } else if (!book.author) {
            response.status = 404
            response.message = 'Author not found'
        }

        else {
            book.author.remove()
            book.save((err, book) => {
                if (err) {
                    response.satus = 500
                    response.message = 'Internal Server Error'
                } else if (!book) {
                    response.status = 404
                    response.message = 'Author not found'
                }

                res.status(response.status).json(response.message)
            })
        }
    });
}

module.exports.patchOneAuthor = (req, res) => {
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
        if (response.status !== 201) res.status(response.status).json(response.message)

        else {
            if (book.author) {
                if (req.body.name) book.author.name = req.body.name
                if (req.body.rating) book.author.rating = req.body.rating
                book.save((err, updatedbook) => {
                    if (err) {
                        response.status = 500
                        response.message = err
                    } else {
                        response.message = updatedbook
                    }
                    res.status(response.status).json(response.message)
                })
            } else res.status(404).json({ 'message': 'publisher not found' })
        }
    });
}



module.exports.updateOneAuthor = (req, res) => {
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
        if (response.status !== 201) res.status(response.status).json(response.message)

        else {
            if (book.author) {
                if(req.body && req.body.name){
                    if(req.body.rating) book.author.rating = req.body.rating 
                    else book.author.rating = book.author.rating

                    book.author.name = req.body.name
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
            } else res.status(404).json({ 'message': 'publisher not found' })
        }
    });
}

