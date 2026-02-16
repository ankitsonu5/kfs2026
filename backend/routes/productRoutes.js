const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

router.post("/add-products", auth, upload.single("image"), addProducts);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", auth, upload.single("image"), updateProduct);
router.delete("/products/:id", auth, deleteProduct);

module.exports = router;
