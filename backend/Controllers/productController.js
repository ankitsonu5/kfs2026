const Product = require("../models/Products");

exports.addProducts = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;

    const image = req.file ? req.file.filename : "";

    const product = new Product({
      title,
      price,
      description,
      image,
      category,
      stock,
    });

    await product.save();

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body;
    const updateData = { title, price, description, category, stock };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

