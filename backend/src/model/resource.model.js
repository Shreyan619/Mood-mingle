import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String },
    type: {
        type: String,
        required: true
    }, // e.g., 'article', 'video', 'podcast'
    url: {
        type: String,
        required: true
    },
    tags: [String],

}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);