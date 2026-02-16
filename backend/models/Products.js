const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    stock: { type: String, default: "In Stock" },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
