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
  addProductsCSV,
  getRelatedProducts,
} = require("../Controllers/productController");

router.post("/add-products", auth, upload.array("images", 10), addProducts);
router.post("/add-products-csv", auth, upload.single("csvFile"), addProductsCSV);
router.get("/products", getProducts);
router.get("/products/related/:id", getRelatedProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", auth, upload.array("images", 10), updateProduct);
router.delete("/products/:id", auth, deleteProduct);

module.exports = router;
