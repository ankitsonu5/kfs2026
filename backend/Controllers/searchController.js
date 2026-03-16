const Product = require("../models/Products");
const Category = require("../models/Category");

exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, products: [], categories: [] });
    }

    const searchRegex = new RegExp(q, "i");

    // Search for products by title or description
    const products = await Product.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).limit(10).select("title price discountPrice images");

    // Search for categories by name
    const categories = await Category.find({
      name: searchRegex,
    }).limit(5);

    res.json({
      success: true,
      products,
      categories,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
