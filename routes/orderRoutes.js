const express = require("express");
const routes = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
  getOrderByUserById
} = require("../controllers/orderController");
const {validateToken} = require("../middlewares/validateTokenHandler");

routes.use(validateToken);
routes.route("/").get(getAllOrders).post(createOrder);

routes.route("/:id").get(getOrderById).put(updateOrder).delete(deleteOrder);

routes.route("/:user/order").get(getOrdersByUser);

routes.route("/:user/order/:order").get(getOrderByUserById);


module.exports = routes;
