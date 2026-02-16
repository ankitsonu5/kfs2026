const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    res.json({ admin: { name: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.fullName = name;
    if (email) updateData.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
