const express = require("express");
const router = express.Router();
const { signup } = require("../Controllers/signupController");
const { userLogin } = require("../Controllers/loginController");
const {
  forgotPassword,
  resetPassword,
} = require("../Controllers/authController");

router.post("/signup", signup);
router.post("/login", userLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
