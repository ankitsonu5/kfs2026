const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  deleteAccount,
} = require("../Controllers/userProfileController");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.get("/user-settings", auth, getSettings);
router.put("/user-settings", auth, updateSettings);
router.delete("/delete-account", auth, deleteAccount);

module.exports = router;
