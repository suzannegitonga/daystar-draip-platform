const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, school } = req.body;

    // Only student/lecturer roles allowed at self-registration
    const safeRole = ["researcher", "lecturer"].includes(role)
      ? role
      : "researcher";

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
      school,
    });

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    // Compare provided password with hashed password in database
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          school: user.school,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Request password reset (generates token)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log(`\n🔑 PASSWORD RESET TOKEN FOR ${email}:\n${token}\n`);

    // DEV ONLY: Return token in response for testing (remove in production)
    const devToken = process.env.NODE_ENV !== "production" ? token : undefined;

    res.status(200).json({
      status: "success",
      message: "If an account exists, a reset link has been sent.",
      ...(devToken && { resetToken: devToken }),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Token and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  register: registerUser,
  login: loginUser,
  forgotPassword,
  resetPassword,
};
