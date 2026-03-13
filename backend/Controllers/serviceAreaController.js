const ServiceArea = require("../models/ServiceArea");

exports.addArea = async (req, res) => {
  try {
    const { city, pincode, deliveryCharge, minAmount, isActive } = req.body;
    
    // Check if pincode already exists
    const existingArea = await ServiceArea.findOne({ pincode });
    if (existingArea) {
      return res.status(400).json({ success: false, message: "Pincode already exists" });
    }

    const area = new ServiceArea({
      city,
      pincode,
      deliveryCharge,
      minAmount,
      isActive,
    });

    await area.save();
    res.json({ success: true, message: "Service area added successfully", area });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find().sort({ createdAt: -1 });
    res.json({ success: true, areas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getServiceableArea = async (req, res) => {
    try {
      const { pincode } = req.params;
      const area = await ServiceArea.findOne({ pincode, isActive: true });
      if (!area) {
        return res.status(404).json({ success: false, message: "Service not available in this area" });
      }
      res.json({ success: true, area });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

exports.updateArea = async (req, res) => {
  try {
    const area = await ServiceArea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!area) {
      return res.status(404).json({ success: false, message: "Area not found" });
    }
    res.json({ success: true, message: "Area updated successfully", area });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const area = await ServiceArea.findByIdAndDelete(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: "Area not found" });
    }
    res.json({ success: true, message: "Area deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
