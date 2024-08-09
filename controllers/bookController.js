const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const User = require("../models/userModel")

//@desc Get all books
//@route GET /api/books
//@access private
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  console.log(req.headers);
  res.status(200).json(books);
});

//@desc Get book
//@route GET /api/books/:id
//@access private
const getBook = asyncHandler(async (req, res) => {
    console.log(req.params.id);
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  res.status(200).json(book);
});

//@desc Create new book
//@route POST /api/books
//@access private
const createBook = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { title, author, description, price } = req.body;
  if (!title || !author || !description || !price) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  if(isNaN(price) || parseFloat(price) <= 0) {
    res.status(400);
    throw new Error("Price should be a valid number!");
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to create a book");
  }
  const book = await Book.create({
    title: title,
    author: author,
    description: description,
    price: price,
  });
  res.status(201).json(book);
});

//@desc Update book
//@route PUT /api/books/:id
//@access private
const updateBook = asyncHandler(async (req, res) => {
    
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  const { title, author, description, price } = req.body;
  if (!title || !author || !description || !price) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  if(isNaN(price) || parseFloat(price) <= 0) {
    res.status(400);
    throw new Error("Price should be a valid number!");
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to update this book");
  }
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedBook);
});

//@desc Delete book
//@route DELETE /api/books/:id
//@access private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to delete this book");
  }
  await Book.deleteOne({_id:req.params.id});
  res.status(200).json(book);
});

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
