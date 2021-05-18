const books = require('../data/MOCK_DATA.json')

module.exports.getAllBooks = (req, res) => {
    let author;
    let title;
    let filtered = books;

    if(req.query && req.query.author) {
        author = req.query.author
        filtered = books.filter(book => book.author == author)
    }
    if(req.query && req.query.title) {
        title = req.query.title
        filtered = books.filter(book => book.title == title)
    }
    
    res.status(200).json(filtered)


}

module.exports.getBookById = (req, res) => {
    let id = req.params.id;
    let book = books.filter(book => book.id == id)
    res.status(200).json(book)
}


