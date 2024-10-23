import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator'
import OTP from "../models/otp.model.js";
import mailSender from "../utils/mailSender.js";
import passwordUpdated from '../templates/passwordUpdated.js'
import {uploadImageToCloudinary} from "../lib/cloudinary.js";
import Subscription from "../models/subscription.model.js";
import { createOrder, verifyPayment } from "../controllers/razerpay.controller.js";

export const signup = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }


        const { name, username, email, password, otp } = req.body;

        if (!name || !username || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields are required" })
        }



        const existingUserEmail = await User.findOne({ email })
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }


        const existingUserUsername = await User.findOne({ username })
        if (existingUserUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recetntopsss ", recentOtp);
        // validate OTP
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                // ivalid otp
                success: false,
                message: "Invalid OTP",
            });
        }



        //increasing the complexity of the password by using 10 rounds 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Generate default profile picture URL
        const defaultProfilePicture = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;

        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
            profilePicture: defaultProfilePicture
        })
        await user.save()


        // now will generate a token  payload,secret,options
        // const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: "3d"
        // })
        // res.cookie("project-token", token, {
        //     httpOnly: true, //used to prevent XSS attack 
        //     maxAge: 3 * 24 * 60 * 60 * 1000,
        //     sameSite: "strict",// prevents CSRF attack

        // }) 
        res.status(200).json({ message: "User registered successfully" })
        console.log("logging otp here", recentOtp)

        //frontend URL
        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;


      
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Something went wrong" })
    }
}


export const logout = (req, res) => {
    res.clearCookie("project-token")
    res.json({ message: "logout Successfully" })
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create and send token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        await res.cookie("project-token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.json({ message: "Logged in successfully" });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user)
        // req.user has this info 
        // "_id": "66e93d66aa22f806e21a6608",
        // "name": "sahil",
        // "username": "xtreme123",
        // "email": "random@gmail.com",
        // "profilePicture": "",
        // "createdAt": "2024-09-17T08:27:18.430Z",
        // "updatedAt": "2024-09-17T08:27:18.430Z",
        // "__v": 0

    }
    catch (error) {
        console.log(error, 'Error in Current User Middleware')
        return res.status(500).json({ message: ' Server Error' })
    }
}


export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // generate OTP using otp-generator library
        var otp = otpGenerator.generate(6, {
            UpperCaseAlphabets: false,
            LowerCaseAlpahbets: false,
            SpecialCase: false,
            digits: true,
        });
        console.log("OTP generated", otp);
        // check to otp is unique or not
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                digits: true
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayLoad = { email, otp };
        // create an entry in db
        const otpBody = await OTP.create(otpPayLoad);
        console.log(otpBody);
        // return response success
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otpPayLoad
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        // Fetch data
        const { email, oldPassword, newPassword } = req.body;

        // Validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered",
            });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password does not match",
            });
        }

        // Now hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send email that password has been updated
        await mailSender(email, "Password Updated Confirmation", passwordUpdated(user.email, user.name));

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}; 


export const updateProfile = async(req,res)=>{
    try {
        const {name,email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        if(name){
            user.name = name;
        }
       
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


export const updateProfilePicture = async(req,res)=>{
    try {
        const { email } = req.body;
        const displayPicture = req.files.displayPicture;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const result = await uploadImageToCloudinary(displayPicture,"profile",null,null);
        console.log(result);
        user.profilePicture = result.secure_url;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Profile picture updated successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const createSubscription = async (req, res) => {
  try {
    const { userId, plan, duration } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    let amount;
    if (plan === 'Pro' && duration === 'monthly') {
      amount = 999; // Set your price for monthly Pro plan
    } else if (plan === 'Pro' && duration === 'yearly') {
      amount = 9999; // Set your price for yearly Pro plan
    } else {
      return res.status(400).json({ message: "Invalid plan or duration" });
    }

    const order = await createOrder(amount);

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: "Error creating subscription" });
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, plan, duration } = req.body;
    console.log(req.body)
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (duration === 'yearly' ? 12 : 1));

    const subscription = new Subscription({
      user: userId,
      plan,
      duration,
      startDate,
      endDate,
      paymentId: razorpayPaymentId 
    });
    console.log("subscription", subscription)

    await subscription.save();

    user.subscription = plan;
    user.subscriptionEndDate = endDate;
    await user.save();

    res.status(200).json({ message: "Subscription activated successfully" });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    res.status(500).json({ message: "Error verifying subscription" });
  }
};