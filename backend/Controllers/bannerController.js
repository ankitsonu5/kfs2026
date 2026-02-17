const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, status, order } = req.body;
    const image = req.file ? req.file.filename : "";

    if (!image) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const newBanner = new Banner({
      title,
      subtitle,
      image,
      link,
      status,
      order,
    });

    await newBanner.save();
    res
      .status(201)
      .json({ message: "Banner created successfully", banner: newBanner });
  } catch (error) {
    console.error("Create Banner Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all banners (for Admin)
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Get Banners Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get active banners (for Homepage)
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "active" }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Get Active Banners Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link, status, order } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (req.file) {
      // Delete old image
      const oldPath = path.join(__dirname, "../uploads", banner.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      banner.image = req.file.filename;
    }

    banner.title = title || banner.title;
    banner.subtitle = subtitle || banner.subtitle;
    banner.link = link || banner.link;
    banner.status = status || banner.status;
    banner.order = order !== undefined ? order : banner.order;

    await banner.save();
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("Update Banner Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete image file
    const imagePath = path.join(__dirname, "../uploads", banner.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete Banner Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Toggle Banner Status
exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.status = banner.status === "active" ? "inactive" : "active";
    await banner.save();
    res.status(200).json({ message: `Banner is now ${banner.status}`, banner });
  } catch (error) {
    console.error("Toggle Banner Status Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
