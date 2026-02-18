const Banner = require('../models/Banner');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/banners/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    },
}).single('image');

// Create a new banner
exports.createBanner = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        try {
            const { title, active } = req.body;
            const banner = new Banner({
                image: `/uploads/banners/${req.file.filename}`,
                title,
                active: active !== undefined ? active : true,
            });

            await banner.save();
            res.status(201).json(banner);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};

// Get all banners
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        console.error("Error in getBanners:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Delete image file (construct absolute path carefully)
        // Assuming 'server.js' is in the root of 'backend' and uploads are in 'backend/uploads'
        // But verify the path logic if needed. 
        // The stored path is relative: /uploads/banners/filename.ext
        // We need to remove the leading slash to resolve correctly from process.cwd() or __dirname

        // safe deletion
        const filePath = path.join(__dirname, '..', banner.image);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
