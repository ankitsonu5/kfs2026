const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  addArea,
  getAllAreas,
  getServiceableArea,
  updateArea,
  deleteArea,
} = require("../Controllers/serviceAreaController");

// Admin routes
router.post("/service-areas", auth, admin, addArea);
router.get("/service-areas-all", auth, admin, getAllAreas);
router.put("/service-areas/:id", auth, admin, updateArea);
router.delete("/service-areas/:id", auth, admin, deleteArea);

// Public routes for checkout validation
router.get("/service-areas-check", getServiceableArea);
router.get("/service-areas/:pincode", getServiceableArea);

module.exports = router;
