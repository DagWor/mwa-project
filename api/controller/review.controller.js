const { response } = require('express');
const Book = require('../data/book.model');
const { getBookAuthor } = require('./user.controller');

module.exports.getAllReviews = (req, res) => {
    const response = {
        status: 200,
        message: ''
    }

    let offset = 0
    let count = 5

    let maxCount = 10;

    if (req.query && req.query.offset) offset = parseInt(req.query.offset);
    if (req.query && req.query.count) count = parseInt(req.query.count);

    if (isNaN(offset) || isNaN(count)) {
        response.status = 400
        response.message = 'Invalid Query String'
    }

    if (count > maxCount) {
        response.status = 400
        response.message = 'Count can not be greater than ' + maxCount
    }

    if (response.status !== 200) {
        res.status(response.status).json(response.message)
        return
    }
    Book.findById(req.params.id).exec((err, book) => {

        if (err) {
            response.status = 500
            response.message = 'Server Issues'
        }
        else if (!book) response.message = 'No book found'
        else if (!book.reviews && book.reviews.length == 0) response.message = 'No reviews found'
        else response.message = book.reviews.slice(offset, count)

        res.status(200).json(response.message)
    })
}

// module.exports.gameGetById = (req, res) => Game.findById(req.params.id, (err, game) => res.status(200).json(game));
module.exports.getReviewById = (req, res) => {
    Book.findById(req.params.id).exec((err, book) => {
        const response = {
            status: 200,
            message: book
        }
        if (err) {
            response.status = 500
            response.message = 'Internal Server Error'
        }
        else if (!book) {
            response.status = 404
            response.message = 'Book not found'
        }
        else if (book.reviews && book.reviews.length !== 0) {
            let reviewIndex = book.reviews.findIndex(a => a._id == req.params.reviewId);
            if (reviewIndex !== -1) response.message = book.reviews[reviewIndex]
            else {
                response.status = 400
                response.message = 'No review found'
            }
        } else {
            response.status = 400
            response.message = 'No reviews found'
        }


        res.status(response.status).json(response.message);

    })
}

module.exports.addOneReview = (req, res) => {
    const response = {
        status: 201,
        message: ""
    }
    Book.findById(req.params.id).exec((err, book) => {
        if (err) {
            response.status = 500;
            response.message = 'Server'
        } else if (!book) {
            response.status = 400;
            response.message = 'book not found'
        } else {
            let review = {}
            review.review = req.body.review

            if (book.reviews) book.reviews.push(review)
            else book.reviews = [review]
            book.save((err, updated) => {

                if (err) {
                    response.status = 500;
                    response.message = err
                } else if (!book) {
                    response.status = 400;
                    response.message = 'book not found'
                } else {
                    response.message = updated
                    response.status = 201
                }
                res.status(response.status).json(response.message)
            })
        }
    })
}

// TODO

module.exports.updateOneReview = (req, res) => {
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
        else if (response.status !== 201) res.status(response.status).json(response.message)

        else {
            if (err) {
                response.status = 500
                response.message = 'Internal Server Error'
            }
            else if (!book) {
                response.status = 404
                response.message = `Could not get book with ID ${req.params.id}`
            }
            else if (book.reviews && book.reviews.length !== 0) {
                let reviewIndex = book.reviews.findIndex(a => a._id == req.params.reviewId);
                let review = book.reviews.find(a => a._id == req.params.reviewId);
                let newReview = {}

                if (req.body.review) newReview.review = req.body.review
                newReview.date = Date.now()
                newReview._id = review._id

                if (reviewIndex !== -1) {
                    book.reviews[reviewIndex] = newReview

                    book.save((err, updatedbook) => {
                        if (err) {
                            response.status = 500
                            response.message = err
                        } else {
                            response.message = updatedbook
                        }
                        res.status(response.status).json(response.message)
                    })
                } else res.status(404).json({ 'message': "review not found" })

            } else res.status(404).json({ 'message': "review not found" })

        }
    })
}

module.exports.patchOneReview = (req, res) => {
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
            else if (response.status !== 201) res.status(response.status).json(response.message)

            else {

                if (err) {
                    response.status = 500
                    response.message = 'Internal Server Error'
                }
                else if (!book) {
                    response.status = 404
                    response.message = `Could not get book with ID ${req.params.id}`
                }
                else if (book.reviews && book.reviews.length !== 0) {
                    let review = book.reviews.find(a => a._id == req.params.reviewId);
                    let reviewIndex = book.reviews.findIndex(a => a._id == req.params.reviewId);
                    let newReview = {}

                    if (req.body.name) newReview.review = req.body.review
                    else newReview.review = review.review

                    newReview._id = review._id

                    if (reviewIndex !== -1) {
                        book.reviews[reviewIndex] = newReview

                        book.save((err, updatedBook) => {
                            if (err) {
                                response.status = 500
                                response.message = err
                            } else {
                                response.message = updatedBook
                            }
                            res.status(response.status).json(response.message)
                        })
                    } else res.status(404).json({ 'message': "review not found" })

                } else res.status(404).json({ 'message': "review not found" })

            }
        })
    }
}

module.exports.deleteOneReview = (req, res) => {
        Book.findById(req.params.id, (err, book) => {
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

            let review = book.reviews.findIndex(a => a._id == req.params.reviewId);
            book.reviews.pop(review)

            book.save((err, updatedBook) => {
                if (err) {
                    response.status = 500
                    response.message = err
                } else {
                    response.message = updatedBook
                }
                res.status(response.status).json(response.message)
            })
        })
}