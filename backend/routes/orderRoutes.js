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

router.post("/place-order", auth, placeOrder);

router.get("/my-orders", auth, getMyOrders);

router.get("/orders", auth, admin, getAllOrders);
router.put("/orders/:id", auth, admin, updateOrderStatus);

router.delete("/orders/:id", auth, admin, deleteOrder);

router.put("/my-orders/cancel/:id", auth, cancelOrder);

router.delete("/my-orders/:id", auth, userDeleteOrder);

module.exports = router;