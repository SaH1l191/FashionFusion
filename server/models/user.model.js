import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    subscription: {
        type: String,
        enum: ['Basic', 'Pro'],
        default: 'Basic'
    },
    subscriptionEndDate: {
        type: Date
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User 