const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} = require("../Controllers/bannerController");

router.post("/add-banner", auth, upload.single("image"), createBanner);
router.get("/banners", getAllBanners);
router.get("/banners/active", getActiveBanners);
router.put("/banners/:id", auth, upload.single("image"), updateBanner);
router.delete("/banners/:id", auth, deleteBanner);
router.patch("/banners/:id/toggle", auth, toggleBannerStatus);

module.exports = router;
