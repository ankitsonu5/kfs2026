const express = require("express");
const router = express.Router();
const wishlistController = require("../Controllers/wishlistController");
const auth = require("../middlewares/auth");

// All wishlist routes are protected
router.get("/wishlist", auth, wishlistController.getWishlist);
router.post("/wishlist/add", auth, wishlistController.addToWishlist);
router.delete(
  "/wishlist/remove/:productId",
  auth,
  wishlistController.removeFromWishlist,
);

module.exports = router;
