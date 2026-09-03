const ServiceArea = require("../models/ServiceArea");

exports.addArea = async (req, res) => {
  try {
    const { city, pincode, deliveryCharge, minAmount, isActive } = req.body;
    
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const trimmedCity = city.trim();
    const trimmedPincode = pincode ? pincode.trim() : "";

    // Check if duplicate exists
    if (trimmedPincode) {
      const existingArea = await ServiceArea.findOne({ pincode: trimmedPincode });
      if (existingArea) {
        return res.status(400).json({ success: false, message: "This pincode is already added" });
      }
    } else {
      // Check if city-wide area already exists
      const existingCityArea = await ServiceArea.findOne({
        city: new RegExp(`^${trimmedCity}$`, "i"),
        $or: [{ pincode: "" }, { pincode: { $exists: false } }, { pincode: null }]
      });
      if (existingCityArea) {
        return res.status(400).json({ success: false, message: "City-wide service area already exists for this city" });
      }
    }

    const area = new ServiceArea({
      city: trimmedCity,
      pincode: trimmedPincode,
      deliveryCharge: deliveryCharge !== undefined ? deliveryCharge : 0,
      minAmount: minAmount !== undefined ? minAmount : 0,
      isActive: isActive !== undefined ? isActive : true,
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
    const pincode = req.query.pincode || req.params.pincode || "";
    const city = req.query.city || "";

    const trimmedPincode = pincode ? pincode.toString().trim() : "";
    const trimmedCity = city ? city.toString().trim() : "";

    let area = null;

    if (trimmedCity) {
      const cityRegex = new RegExp(`^${trimmedCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");

      if (trimmedPincode && trimmedPincode !== "undefined" && trimmedPincode !== "null" && trimmedPincode !== "check") {
        // When both City and Pincode are provided:
        // Match ONLY IF (city matches AND specific pincode matches) OR (city matches AND city-wide entry with blank pincode exists)
        area = await ServiceArea.findOne({
          city: cityRegex,
          isActive: true,
          $or: [
            { pincode: trimmedPincode },
            { pincode: "" },
            { pincode: null },
            { pincode: { $exists: false } }
          ]
        });
      } else {
        // When only City is provided (e.g. before entering pincode):
        // Match only if entire city is serviceable (pincode is empty/blank)
        area = await ServiceArea.findOne({
          city: cityRegex,
          isActive: true,
          $or: [
            { pincode: "" },
            { pincode: null },
            { pincode: { $exists: false } }
          ]
        });
      }
    } else if (trimmedPincode && trimmedPincode !== "undefined" && trimmedPincode !== "null" && trimmedPincode !== "check") {
      // Only Pincode provided (no city given)
      area = await ServiceArea.findOne({
        pincode: trimmedPincode,
        isActive: true
      });
    }

    if (!area) {
      return res.status(404).json({ success: false, message: "Delivery is not available in this area/pincode" });
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
