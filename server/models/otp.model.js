import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../templates/emailVerificationTemplate.js";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m', // OTP will expire in 5 minutes
  }
});

// Function to send emails
const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(email, "Verification email from Lando", otpTemplate(otp));
    console.log("Email sent successfully:", mailResponse);
  } catch (err) {
    console.log("Error occurred while sending mail:", err);
    throw err;
  }
};

// Pre-save middleware
OTPSchema.pre("save", async function(next) {
  await sendVerificationEmail(this.email, this.otp);
  next(); // Proceed to next middleware
});

// Export the OTP model
const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
