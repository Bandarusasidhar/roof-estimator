const Config = require("../models/Config");
const Lead = require("../models/Lead");

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leads",
            error: error.message
        });
    }
};

const updateConfig = async (req, res) => {
    try {
        const config = await Config.findOne({ active: true });

        if (!config) {
            return res.status(404).json({
                message: "Active configuration not found"
            });
        }

        const { questions, modifiers } = req.body;

        if (questions) {
            config.questions = questions;
        }

        if (modifiers) {
            config.modifiers = modifiers;
        }

        config.config_version += 1;

        await config.save();

        res.json({
            message: "Configuration updated successfully",
            config
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update configuration",
            error: error.message
        });
    }
};

module.exports = {
    getLeads,
    updateConfig
};