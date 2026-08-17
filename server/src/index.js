const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/database");
const configRoutes = require("./routes/configRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/config", configRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Roof Estimator API is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();