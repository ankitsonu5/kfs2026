const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Forgot Password - Generate Token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to user
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (1 hour)
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // In a real app, send email here. For now, return token for testing/UI flow.
    res.json({
      success: true,
      message: "Reset link generated",
      resetToken, // Returning token directly for the user to use in the URL
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
