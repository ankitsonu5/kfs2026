const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = "";
    if (req.originalUrl.includes("category")) {
      subfolder = "categories";
    } else if (req.originalUrl.includes("product")) {
      subfolder = "products";
    } else if (req.originalUrl.includes("banner")) {
      subfolder = "banners";
    } else if (req.originalUrl.includes("aboutus")) {
      subfolder = "aboutus";
    } else if (req.originalUrl.includes("blog")) {
      subfolder = "blogs";
    }

    const uploadPath = path.join("uploads", subfolder);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
