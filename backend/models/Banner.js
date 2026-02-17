const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Banner", bannerSchema);
