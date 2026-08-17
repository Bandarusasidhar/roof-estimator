const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    rate_per_sqft: Number,
    multiplier: Number,
    tear_off_per_sqft: Number
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["number", "select"],
        required: true
    },
    order: {
        type: Number,
        required: true
    
    },
    unit: String,
    required: {
        type: Boolean,
        default: true
    },
    min: Number,
    max: Number,
    active: {
        type: Boolean,
        default: true
    },
    options: [OptionSchema]
}, { _id: false });

const ConfigSchema = new mongoose.Schema({
    config_version: {
        type: Number,
        required: true
    },
    business: {
        name: String,
        region: String,
        currency: String
    },
    active: {
        type: Boolean,
        default: true
    },
    questions: [QuestionSchema],
    modifiers: {
        waste_factor: Number,
        permit_flat_fee: Number,
        range_spread_pct: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Config", ConfigSchema);