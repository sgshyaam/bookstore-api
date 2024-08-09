const express = require("express");
const routes = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const {validateToken} = require("../middlewares/validateTokenHandler");

routes.use(validateToken);
routes.route("/").get(getAllBooks).post(createBook);

routes.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

module.exports = routes;
