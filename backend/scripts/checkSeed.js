require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const fs = require("fs");

const check = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kfs2026";
        await mongoose.connect(mongoUri);
        const count = await Category.countDocuments({ name: { $in: ["Fruits & Vegetables", "Dairy & Breakfast"] } });
        fs.writeFileSync("seed_status.txt", `Found ${count} categories`);
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        fs.writeFileSync("seed_status.txt", `Error: ${error.message}`);
        process.exit(1);
    }
};

check();
