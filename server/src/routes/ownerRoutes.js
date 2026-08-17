const express = require("express");

const {
    getLeads,
    updateConfig
} = require("../controllers/ownerController");

const {
    requireOwnerAuth
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/leads",
    requireOwnerAuth,
    getLeads
);

router.put(
    "/config",
    requireOwnerAuth,
    updateConfig
);

module.exports = router;