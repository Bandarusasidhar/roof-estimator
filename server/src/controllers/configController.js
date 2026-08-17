const Config = require("../models/Config");

const getConfig = async (req, res) => {
    try {
        const config = await Config.findOne({ active: true });

        if (!config) {
            return res.status(404).json({
                message: "Configuration not found"
            });
        }

        res.json(config);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch configuration",
            error: error.message
        });
    }
};

module.exports = {
    getConfig
};