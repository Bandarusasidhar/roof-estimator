const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
    external_id: String,
    captured_at: {
        type: Date,
        default: Date.now
    },
    config_version: Number,
    
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    answers: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    estimate_low: {
        type: Number,
        required: true
    },
    estimate_high: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Lead", LeadSchema);