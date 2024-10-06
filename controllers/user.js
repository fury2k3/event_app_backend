const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/sendEmail");
const { resetCodeContent } = require('../template/ressetCode');
const { qrcodeInvitation } = require('../template/qrcode');


const QRCode = require('qrcode');



// Sign-up function
const signUp = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ userName, firstName, lastName, email, password: hashedPassword, role: "user", });
    await newUser.save();

    // Return success response
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    // Return success response with additional data
    res.status(200).json({
      token,
      userId: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* ----------------------------------------------------- */
/**
 * @Desc   : forgot password
 * @Route  : @Post /api/users/forgotPassword
 * @access : public
 */
const forgotPassword = async (req, res) => {
  try {
    // Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Generate code verification
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash Reset Code and save it in the database
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.passwordResetCode = hashedResetCode;

    // Add expiration time for password reset code
    user.passwordResetExpired = Date.now() + 15 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();
    // Send Reset Code via email

    await sendEmail({
      email: user.email,
      subject: `Password Reset Code`,
      html: resetCodeContent(resetCode),
    });

    res.status(200).json({
      status: "success",
      message: "Your password reset code sent to your email",
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });

  }

};

/* ----------------------------------------------------- */

/**
 * @Desc   : Verify Reset Code
 * @Route  : @Post /api/users/verifyResetCode
 * @access : public
 */
const verifyPasswordResetCode = async (req, res) => {
  try {
    // Get User from database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });

    }
    // Hash Reset Code that comes from body and compare it to the reset code stored in database
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    if (
      user.passwordResetCode !== hashedResetCode ||
      user.passwordResetExpired.getTime() < Date.now()
    ) {
      // Reset code is wrong or expired
      return res.status(400).json({ msg: "Invalid reset code or expired" });

    }

    user.passwordResetVerified = true;
    await user.save();

    return res.status(200).json({ msg: "you can move to next step" });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });

  }
};

/* ----------------------------------------------------- */

/**
 * @Desc   : Reset password
 * @Route  : @Put /api/auth/resetPassword
 * @access : public
 */
const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.passwordResetVerified) {
      return res.status(400).json({ msg: "Reset Code not verified" });

    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    // update user information
    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return res.status(200).json({ msg: "user password updated" });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};

const sendEmailQr = async (req, res) => {

  try {
    const base64Url = await QRCode.toDataURL('welcome');


    // Generate the QR code base64 URL
    const qrCodeDataURL = await QRCode.toDataURL(base64Url);

    // Verify that the base64 string is correct by logging it to the console
    console.log(qrCodeDataURL);

    await sendEmail({
      email: req.body.email,
      subject: `QR CODE`,
      html: qrcodeInvitation(qrCodeDataURL),
    });

    res.status(200).json({
      status: "success",
      message: "Your Qr code",
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });

  }



}


module.exports = {
  signUp,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
  sendEmailQr
};
