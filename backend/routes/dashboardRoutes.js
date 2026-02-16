const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
} = require("../Controllers/dashboardController");

router.get("/dashboard-stats", auth, getDashboardStats);
router.get("/all-users", auth, getAllUsers);
router.delete("/delete-user/:id", auth, deleteUser);

module.exports = router;
