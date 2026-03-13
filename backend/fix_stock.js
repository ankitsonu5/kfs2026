const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./models/Products");

const fixProductStock = async () => {
  console.log("Starting fix script...");
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kfs2026";
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected to database successfully");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check`);

    let fixedCount = 0;
    for (const prod of products) {
      if (typeof prod.stock !== "number") {
        console.log(`Fixing product: ${prod.title} (Stock was ${typeof prod.stock}: "${prod.stock}")`);
        prod.stock = Number(prod.stock) || 0;
        await Product.updateOne({ _id: prod._id }, { $set: { stock: prod.stock } });
        fixedCount++;
      } else if (prod.stock === undefined || prod.stock === null) {
          console.log(`Fixing product: ${prod.title} (Stock was null/undefined)`);
          prod.stock = 0;
          await Product.updateOne({ _id: prod._id }, { $set: { stock: 0 } });
          fixedCount++;
      }
    }

    console.log(`Operation finished. Total fixed: ${fixedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Critical error in fix script:", err);
    process.exit(1);
  }
};

fixProductStock();
