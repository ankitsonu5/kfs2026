const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card"],
    default: "cod",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: [
      "Placed",
      "Confirmed",
      "Shipped",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
