const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type:String, required: true, unique: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},    
    createdAt: { type:Date, default: Date.now}
});

module.exports = mongoose.model("Category", categorySchema);