const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" },
    notifications: {
      orderUpdates: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
