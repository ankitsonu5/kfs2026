const express = require('express');
const router = express.Router();
const { createBanner, getBanners, deleteBanner } = require('../controllers/bannerController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// Public route to get banners
router.get('/', getBanners);

// Admin routes to create and delete banners
router.post('/', auth, admin, createBanner);
router.delete('/:id', auth, admin, deleteBanner);

module.exports = router;
