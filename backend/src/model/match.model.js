import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    compatibilityScore: {
        type: Number,
        required: true
    },
    matchedAt: {
        type: Date,
        default: Date.now
    },
});

export const Match = mongoose.model('Match', matchSchema);