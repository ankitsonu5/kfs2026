require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./backend/models/Category");

const checkCategories = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kfs2026";
        await mongoose.connect(mongoUri);
        const categories = await Category.find();
        console.log("Categories in DB:", JSON.stringify(categories, null, 2));
        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkCategories();
