import mongoose from "mongoose"

const therapySessionSchema = new mongoose.Schema({
    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    therapist: {
        type: String,
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    notes: { type: String },

}, { timestamps: true });

export const TherapySession = mongoose.model('TherapySession', therapySessionSchema);