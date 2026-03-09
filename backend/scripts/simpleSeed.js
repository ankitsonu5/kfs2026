const mongoose = require("mongoose");

// Manual Schema definition to avoid any file path issues
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const categories = [
    { name: "Fruits & Vegetables", image: "https://cdn-icons-png.flaticon.com/512/2329/2329865.png" },
    { name: "Dairy & Breakfast", image: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png" },
    { name: "Rice, Atta & Dal", image: "https://cdn-icons-png.flaticon.com/512/2713/2713931.png" },
    { name: "Masala & Spices", image: "https://cdn-icons-png.flaticon.com/512/2082/2082103.png" },
    { name: "Snacks & Biscuits", image: "https://cdn-icons-png.flaticon.com/512/2553/2553642.png" },
    { name: "Beverages", image: "https://cdn-icons-png.flaticon.com/512/3121/3121118.png" },
    { name: "Household Items", image: "https://cdn-icons-png.flaticon.com/512/1216/1216649.png" },
];

const seed = async () => {
    try {
        const mongoUri = "mongodb://127.0.0.1:27017/kfs2026";
        console.log("Connecting to:", mongoUri);
        await mongoose.connect(mongoUri);
        console.log("Connected.");

        const admin = await User.findOne({ role: "admin" });
        const adminId = admin ? admin._id : null;

        for (const c of categories) {
            const exists = await Category.findOne({ name: c.name });
            if (!exists) {
                await new Category({ ...c, createdBy: adminId }).save();
                console.log("Added:", c.name);
            }
        }
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
