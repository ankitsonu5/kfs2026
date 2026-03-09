require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const User = require("../models/User");

const categories = [
    { name: "Fruits & Vegetables", image: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png" },
    { name: "Dairy & Breakfast", image: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png" },
    { name: "Rice, Atta & Dal", image: "https://cdn-icons-png.flaticon.com/512/2713/2713931.png" },
    { name: "Masala & Spices", image: "https://cdn-icons-png.flaticon.com/512/2082/2082103.png" },
    { name: "Snacks & Biscuits", image: "https://cdn-icons-png.flaticon.com/512/2553/2553642.png" },
    { name: "Beverages", image: "https://cdn-icons-png.flaticon.com/512/3121/3121118.png" },
    { name: "Household Items", image: "https://cdn-icons-png.flaticon.com/512/1216/1216649.png" },
    { name: "Grocery Items", image: "https://cdn-icons-png.flaticon.com/512/3724/3724720.png" },
];

const seedCategories = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kfs2026";
        console.log("Starting seeding process...");
        console.log("Connecting to:", mongoUri);

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully.");

        process.on("unhandledRejection", (err) => {
            console.error("Unhandled Rejection:", err);
            process.exit(1);
        });

        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            console.log(`Found admin user: ${admin.email} (ID: ${admin._id})`);
        } else {
            console.log("Warning: No admin user found. Creating categories without createdBy field.");
        }

        const adminId = admin ? admin._id : null;

        for (const catData of categories) {
            const existing = await Category.findOne({ name: catData.name });
            if (!existing) {
                const newCat = new Category({
                    ...catData,
                    status: "active",
                    createdBy: adminId,
                });
                await newCat.save();
                console.log(`[PASS] Added category: ${catData.name}`);
            } else {
                console.log(`[SKIP] Category already exists: ${catData.name}`);
            }
        }

        console.log("Seeding process completed successfully!");
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("CRITICAL ERROR during seeding:", error);
        process.exit(1);
    }
};

seedCategories();
