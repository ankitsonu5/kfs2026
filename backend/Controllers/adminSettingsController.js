const Settings = require("../models/AdminSettings");

exports.saveSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (settings) {
      settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    } else {
      settings = await Settings.create(req.body);
    }

    res.json({ message: "Settings saved", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
