import User from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import  passwordUpdated  from "../templates/passwordUpdated.js";

// Reset Password Token handler
export const resetPasswordToken = async (req, res) => {
  try {
    // Get email from request body
    const { email } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // Generate token
    const token = crypto.randomUUID();

    // Update user with token & expiration time
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // Create URL
    const url = `http://localhost:5173/update-password/${token}`;

    // Send email containing the URL
    await mailSender(email, "Password Reset Link", `Password reset link: ${url}`);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, please check your email and change your password",
      url
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting your password",
    });
  }
};

// Reset Password handler
export const resetPassword = async (req, res) => {
  try {
    
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match, please try again",
      });
    }

    const userDetails = await User.findOne({ token });
    
    // If no entry, token is invalid
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "Token is expired, please regenerate your token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    await mailSender(userDetails.email, "Password Reset Confirmation", passwordUpdated(userDetails.email, userDetails.firstName));

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting your password",
    });
  }
};
