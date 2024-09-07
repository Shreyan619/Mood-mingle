import mongoose from "mongoose"
import validator from "validator"
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Enter unique email"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: function () {
            return this.provider !== 'google'
        },
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
    },
    picture: {
        type: String,
        // required: true
    },
    provider: {
        type: String,
        default: 'local',
    },
    moodTracking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mood'
    }],
    forumPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    rewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (this.isModified('password') && this.provider !== 'google') {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    if (this.provider === 'google') {
        // Skip password check for Google users
        return true;
    }
    if (!password) {
        // If no password or user is a Google user, skip password check
        return false;
    }
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema)