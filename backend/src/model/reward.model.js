import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    badges: [String], // e.g., ['MoodMaster', 'Helper']
}, { timestamps: true });

export const Reward = mongoose.model('Reward', rewardSchema);