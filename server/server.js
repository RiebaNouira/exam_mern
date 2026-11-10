const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Load server settings from server/.env during local development.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the local Vite app, or the configured deployed frontend, to call this API.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

// Read JSON request bodies so routes can access req.body.
app.use(express.json());

// Mount account registration and login routes under /api/auth.
app.use("/api/auth", authRoutes);

// Mount public and protected event routes under /api/events.
app.use("/api/events", eventRoutes);

// Mount feedback listing/creation and deletion at their exact API paths.
app.use("/api", feedbackRoutes);

// Give the browser and deployment tools a simple way to check server availability.
app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "RunClub Hub API is running." });
});

// Start listening only after MongoDB has connected successfully.
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`RunClub Hub API is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

startServer();
