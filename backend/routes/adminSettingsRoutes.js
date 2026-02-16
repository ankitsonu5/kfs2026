const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  saveSettings,
  getSettings,
} = require("../Controllers/adminSettingsController");

router.post("/adminsettings", auth, saveSettings);
router.get("/adminsettings", auth, getSettings);

module.exports = router;
