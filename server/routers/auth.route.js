import express from 'express';
import {
    signup,
    login,
    logout,
    getCurrentUser, changePassword ,sendOTP,updateProfile,updateProfilePicture
} from '../controllers/auth.controller.js';

  
import { resetPasswordToken,resetPassword,} from "../controllers/ResetPassword.js"
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protectRoute, logout);
router.get('/current', protectRoute, getCurrentUser);
router.post('/sendotp', sendOTP);
router.post("/changepassword", protectRoute, changePassword)
router.post("/updateprofile", protectRoute, updateProfile)
router.post("/updateprofilepicture", protectRoute, updateProfilePicture)
//above is with login 


// passwrod token - without login 

router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)
export default router;

