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
  userDeleteOrder,
} = require("../Controllers/orderController");

// user place order
router.post("/place-order", auth, placeOrder);

// user own orders
router.get("/my-orders", auth, getMyOrders);

// admin all orders
router.get("/orders", auth, admin, getAllOrders);

// admin update status
router.put("/orders/:id", auth, admin, updateOrderStatus);

// admin delete
router.delete("/orders/:id", auth, admin, deleteOrder);

// user cancel order
router.put("/my-orders/cancel/:id", auth, cancelOrder);

// user delete order
router.delete("/my-orders/:id", auth, userDeleteOrder);

module.exports = router;
