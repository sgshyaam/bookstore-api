const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Book = require("../models/bookModel");

//@desc Get all orders
//@route GET /api/orders
//@access private
const getAllOrders = asyncHandler(async (req, res) => {
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to view all orders");
  }
  const orders = await Order.find();
  res.status(200).json(orders);
});

//@desc Get order
//@route GET /api/orders/:id
//@access private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to view this order");
  }

  // if (order.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User is not authorized to view this order");
  // }
  res.status(200).json(order);
});

//@desc Get order
//@route GET /api/orders/:user/order
//@access private
const getOrdersByUser = asyncHandler(async (req, res) => {
  const order = await Order.find({user_id: req.params.user});
  if (!order) {
    res.status(404);
    throw new Error("Order not found", req.params.user);
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to view user orders");
  }
  res.status(200).json(order);
});

//@desc Get order
//@route GET /api/orders/:user/order/:order
//@access private
const getOrderByUserById = asyncHandler(async (req, res) => {
  const order = await Order.find({_id: req.params.order, user_id: req.params.user});
  if (!order) {
    res.status(404);
    throw new Error("Order not found", req.params.user);
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to view user orders");
  }
  res.status(200).json(order);
});

//@desc Create new order
//@route POST /api/orders
//@access private
const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { books } = req.body;
  
  let totalAmount = 0;
  for (let item of books) {
    if (!item.book_id || !item.quantity || !item.title) {
        res.status(404);
        throw new Error("All fields are mandatory");
      }    
    const book = await Book.findById(item.book_id);
    if (!book)
      return res
        .status(404)
        .json({ message: `Book with ID ${item.book_id} not found` });  
    totalAmount += book.price * item.quantity;
  }

  console.log({
    user_id: req.user.id,
    username: req.user.username,
    books,
    totalAmount
  });
  const order = await Order.create({
    user_id: req.user.id,
    username: req.user.username,
    books,
    totalAmount
  });
  res.status(201).json(order);
});

//@desc Update order
//@route PUT /api/orders/:id
//@access private
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to update this order");
  }
  // console.log(JSON.stringify(req.body))

  const { books } = req.body.books;

  let totalAmount = 0;
  for (let item of books) {
    if (!item.book_id || !item.quantity) {
        res.status(404);
        throw new Error("Illegal request");
      }    
    const book = await Book.findById(item.book_id);
    if (!book)
      return res
        .status(404)
        .json({ message: `Book with ID ${item.book_id} not found` });

    totalAmount += book.price * item.quantity;
  }
  const updateData = {
    ...req.body,
    totalAmount
  };

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  
  res.status(200).json(updatedOrder);
});

//@desc Delete order
//@route DELETE /api/orders/:id
//@access private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to delete this order");
  }

  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json(order);
});

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  getOrderByUserById,
  createOrder,
  updateOrder,
  deleteOrder,
};