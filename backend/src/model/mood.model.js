import mongoose from "mongoose"

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true
    }, // e.g., 'happy', 'sad'
    description: { type: String },
    date: {
        type: Date,
        default: Date.now
    },
});

export const Mood = mongoose.model('Mood', moodSchema);
