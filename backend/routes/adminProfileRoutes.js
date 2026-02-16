const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../Controllers/adminProfileController");
const auth = require("../middlewares/auth");

router.get("/adminprofile", auth, getProfile);
router.put("/adminprofile", auth, updateProfile);

module.exports = router;
