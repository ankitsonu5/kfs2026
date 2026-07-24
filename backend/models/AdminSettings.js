const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
    supportEmail: String,
    supportEmail2: String,
    primaryPhone: String,
    secondaryPhone: String,
    deliveryCharge: Number,
    minOrderForFreeDelivery: Number,
});

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);