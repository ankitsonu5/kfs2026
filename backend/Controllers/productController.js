const Product = require("../models/Products");
const Category = require("../models/Category");
const csv = require("csv-parser");
const fs = require("fs");

exports.addProducts = async (req, res) => {
  try {
    const {
      title,
      price,
      discountPrice,
      description,
      category,
      stock,
      bulkPrice,
      bulkMinQty,
      isTopSellingProducts,
      isDealsOfDay,
      isRice,
      isAttaAndFlour,
      isDryFruites,
      isDalAndPulses,
      isMasala,
      isNamkeenAndSnacks,
    } = req.body;

    const images = req.files ? req.files.map((file) => file.filename) : [];

    const product = new Product({
      title,
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      description,
      images,
      category,
      stock: Number(stock) || 0,
      bulkPrice: Number(bulkPrice) || 0,
      bulkMinQty: Number(bulkMinQty) > 0 ? Number(bulkMinQty) : 1,
      isTopSellingProducts,
      isDealsOfDay,
      isRice,
      isAttaAndFlour,
      isDryFruites,
      isDalAndPulses,
      isMasala,
      isNamkeenAndSnacks,
    });

    await product.save();

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.addProductsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No CSV file uploaded." });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const productsToInsert = [];
          
          for (let row of results) {
             // Support both custom headers and raw WooCommerce headers
             const title = row.title || row.Name;
             
             // In this app, 'price' = Selling Price, 'discountPrice' = MRP
             const customSellingPrice = Number(row.price);
             const customMRP = Number(row.discountPrice);
             const wooSalePrice = Number(row["Sale price"]);
             const wooRegularPrice = Number(row["Regular price"]);
             
             const discountPrice = customMRP || wooRegularPrice || 0; // MRP
             const price = customSellingPrice || wooSalePrice || discountPrice || 0; // Selling Price

             const description = row.description || row.Description || "";
             const stock = Number(row.stock) || Number(row.Stock) || 0;
             const bulkPrice = Number(row.bulkPrice) || Number(row["Bulk Price"]) || 0;
             const bulkMinQty = Number(row.bulkMinQty) || Number(row["Bulk Min Qty"]) || 1;
             const categoryName = row.categoryName || row.Categories;
             
             const isTopSellingProducts = row.isTopSellingProducts === "true" || row.isTopSellingProducts === "1";
             const isDealsOfDay = row.isDealsOfDay === "true" || row.isDealsOfDay === "1";
             const isRice = row.isRice === "true" || row.isRice === "1";
             const isAttaAndFlour = row.isAttaAndFlour === "true" || row.isAttaAndFlour === "1";
             const isDryFruites = row.isDryFruites === "true" || row.isDryFruites === "1";
             const isDalAndPulses = row.isDalAndPulses === "true" || row.isDalAndPulses === "1";
             const isMasala = row.isMasala === "true" || row.isMasala === "1";
             const isNamkeenAndSnacks = row.isNamkeenAndSnacks === "true" || row.isNamkeenAndSnacks === "1";

             let categoryIds = [];
             if (categoryName) {
               let cat = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });
               if (!cat) {
                 cat = new Category({ name: categoryName, image: "default-category.png" });
                 await cat.save();
               }
               categoryIds.push(cat._id);
             }
             
             if (title && price > 0) {
               productsToInsert.push({
                 title, price, discountPrice, description, stock, bulkPrice, bulkMinQty,
                 category: categoryIds,
                 isTopSellingProducts, isDealsOfDay, isRice, isAttaAndFlour,
                 isDryFruites, isDalAndPulses, isMasala, isNamkeenAndSnacks,
                 images: []
               });
             }
          }
          
          if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
          }
          
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          
          res.json({ success: true, message: `${productsToInsert.length} products added successfully from CSV.` });
        } catch (error) {
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          res.json({ success: false, error: error.message });
        }
      });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    res.json({ success: true, products: relatedProducts });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      discountPrice,
      description,
      category,
      stock,
      bulkPrice,
      bulkMinQty,
      isTopSellingProducts,
      isDealsOfDay,
      isRice,
      isAttaAndFlour,
      isDryFruites,
      isDalAndPulses,
      isMasala,
      isNamkeenAndSnacks,
    } = req.body;
    const updateData = {
      title,
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      description,
      category,
      stock: Number(stock) || 0,
      bulkPrice: Number(bulkPrice) || 0,
      bulkMinQty: Number(bulkMinQty) > 0 ? Number(bulkMinQty) : 1,
      isTopSellingProducts,
      isDealsOfDay,
      isRice,
      isAttaAndFlour,
      isDryFruites,
      isDalAndPulses,
      isMasala,
      isNamkeenAndSnacks,
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
