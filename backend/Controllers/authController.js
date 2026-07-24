const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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

    // Send email with reset token
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const frontendUrl = req.headers.origin || "http://localhost:3000";
      const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;

      const mailOptions = {
        from: smtpUser,
        to: user.email,
        subject: "Password Reset Request - KFS",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; color: #374151;">
            <div style="background-color: #16a34a; padding: 24px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">KFS</h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Request</p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="margin-top: 0; color: #16a34a; font-size: 20px;">Hello,</h2>
              <p style="font-size: 16px; line-height: 1.5;">You are receiving this email because you (or someone else) requested a password reset for your account.</p>
              <p style="font-size: 16px; line-height: 1.5;">Please click on the link below, or copy and paste it into your browser to complete the process within 1 hour:</p>
              <div style="margin: 24px 0; text-align: center;">
                <a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
              </div>
              <p style="font-size: 14px; color: #6b7280; line-height: 1.5; word-break: break-all;">
                Link: <a href="${resetUrl}" style="color: #16a34a;">${resetUrl}</a>
              </p>
              <p style="font-size: 16px; line-height: 1.5; margin-top: 24px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: "Check your email for the reset link.",
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
