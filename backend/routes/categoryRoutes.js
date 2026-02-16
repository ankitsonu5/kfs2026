const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");

router.post("/add-category", auth, createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", auth, updateCategory);
router.delete("/categories/:id", auth, deleteCategory);

module.exports = router;
