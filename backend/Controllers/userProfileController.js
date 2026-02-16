const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Cart = require("../models/Cart");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "phone address city pincode notifications",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ settings: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { phone, address, city, pincode, notifications } = req.body;

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (notifications !== undefined) updateData.notifications = notifications;

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({ message: "Settings saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    // Delete user's cart
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
