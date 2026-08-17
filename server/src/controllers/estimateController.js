const Config = require("../models/Config");
const Lead = require("../models/Lead");
const { calculateEstimate } = require("../services/calculator");

const createEstimate = async (req, res) => {
    try {
        const { name, phone, email, answers } = req.body;

        // Validate contact details
        if (!name || !phone || !email || !answers) {
            return res.status(400).json({
                message: "Name, phone, email and answers are required"
            });
        }

        // Get active configuration
        const config = await Config.findOne({ active: true });

        if (!config) {
            return res.status(404).json({
                message: "Active configuration not found"
            });
        }

        // Validate answers against configuration
        for (const question of config.questions) {

            if (!question.active) {
                continue;
            }

            const answer = answers[question.key];

            if (
                question.required &&
                (answer === undefined || answer === null || answer === "")
            ) {
                return res.status(400).json({
                    message:` ${question.label} is required`
                });
            }

            if (question.type === "number") {
                const numberValue = Number(answer);

                if (isNaN(numberValue)) {
                    return res.status(400).json({
                        message: `${question.label} must be a number`
                    });
                }

                if (
                    question.min !== undefined &&
                    numberValue < question.min
                ) {
                    return res.status(400).json({
                        message: `${question.label} must be at least ${question.min}`
                    });
                }

                if (
                    question.max !== undefined &&
                    numberValue > question.max
                ) {
                    return res.status(400).json({
                        message: `${question.label} must not exceed ${question.max}`
                    });
                }
            }

            if (question.type === "select") {
                const validOption = question.options.some(
                    option => option.value === answer
                );

                if (!validOption) {
                    return res.status(400).json({
                        message: `Invalid answer for ${question.label}`
                    });
                }
            }
        }

        // Calculate estimate on server
        const estimate = calculateEstimate(config, answers);

        // Save lead
        const lead = await Lead.create({
            name,
            phone,
            email,
            answers,
            config_version: config.config_version,
            estimate_low: estimate.estimate_low,
            estimate_high: estimate.estimate_high
        });

        // Return result
        res.status(201).json({
            message: "Estimate created successfully",
            estimate_low: estimate.estimate_low,
            estimate_high: estimate.estimate_high,
            lead_id: lead._id
        });

    } catch (error) {
        console.error("Estimate error:", error);

        res.status(500).json({
            message: "Failed to create estimate",
            error: error.message
        });
    }
};

module.exports = {
    createEstimate
};