const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    }
})

const ReviewSchema = new Schema({
    review: String,
    date: {
        type: Date,
        default: Date.now()
    }

})

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        default: `${new Date(Date.now()).getFullYear()}`,
        required: true
    },
    edition: {
        type: Number,
        default: 1,
        required: true
    },
    author: AuthorSchema,
    reviews: [ReviewSchema],
    rating: Number
})

module.exports = Book = mongoose.model('books', BookSchema);