const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
} = require("../Controllers/orderController");

// user place order
router.post("/place-order", auth, placeOrder);

// user cancel order
router.put("/cancel-order/:id", auth, cancelOrder);

// user own orders
router.get("/my-orders", auth, getMyOrders);

// admin all orders
router.get("/orders", auth, admin, getAllOrders);

// admin update status
router.put("/orders/:id", auth, admin, updateOrderStatus);

// admin delete
router.delete("/orders/:id", auth, admin, deleteOrder);

module.exports = router;
