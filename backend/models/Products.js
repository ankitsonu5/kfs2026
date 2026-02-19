const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    stock: { type: String, default: "In Stock" },
    images: [{ type: String }],
    isTopSellingProducts: { type: Boolean, default: false },
    isDealsOfDay: { type: Boolean, default: false },
    isRice: { type: Boolean, default: false },
    isAttaAndFlour: { type: Boolean, default: false },
    isDryFruites: { type: Boolean, default: false },
    isDalAndPulses: { type: Boolean, default: false },
    isMasala: { type: Boolean, default: false },
    isNamkeenAndSnacks: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
