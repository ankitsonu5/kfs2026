const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
    siteName: String,
    supportEmail: String,
    deliveryCharge: Number,
});

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);