const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  addToCart,
  getCart,
  removeFromCart,
  decrementCart,
} = require("../Controllers/cartController");

router.post("/add-cart", auth, addToCart);
router.get("/cart", auth, getCart);
router.delete("/cart/:productId", auth, removeFromCart);
router.put("/cart/decrement/:productId", auth, decrementCart);

module.exports = router;
