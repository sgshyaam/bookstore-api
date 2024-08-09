const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc login a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const availableUser = await User.findOne({ username });
  if (availableUser) {
    res.status(400);
    throw new Error("Username already taken!");
  }

  //password hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User ${user} created`);

  if (user) {
    res.status(201).json({ _id: user._id, email: user.email, message: "User registered successfully" });
  } else {
    res.status(400);
    throw new Error("User not created!");
  }
  res.status(200).json({ message: "register a user" });
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ username, email });
  console.log(`Test ${user}`);
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
          admin: user.admin,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "120m",
      }
    );
    console.log({
      username: user.username,
      email: user.email,
      id: user.id,
    });
    res.status(200).json({ accessToken, user , message: "Login successful"});
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({ message: "login a user" });
});

//@desc login a user
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@desc Get all users
//@route GET /api/users
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.admin !== true) {
    res.status(403);
    throw new Error("User is not authorized to update this book");
  }
  const users = await User.find();
  res.status(200).json(users);
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUser = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    if (req.user.admin !== true) {
      res.status(403);
      throw new Error("User is not authorized to update this book");
    }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getAllUsers,
  getUser,
};
