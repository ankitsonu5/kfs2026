const mongoose = require("mongoose");

const serviceAreaSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    trim: true,
    default: "",
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  minAmount: {
    type: Number,
    default: 0, // Above this amount, delivery is free
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceArea", serviceAreaSchema);
