const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  getAllUsers,
  getUser,
} = require("../controllers/userController");
const { validateToken, blacklistNewToken } = require("../middlewares/validateTokenHandler");
const routes = express.Router();

routes.post("/register", registerUser);

routes.post("/login", loginUser);

routes.get("/current", validateToken, currentUser);

routes.post("/logout", blacklistNewToken);


routes.get("/", validateToken, getAllUsers);


routes.get("/:id", validateToken, getUser);

module.exports = routes;
