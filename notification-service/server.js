import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectRabbitMQ } from "./rabbitmq.js";
import "./grpc/server.js";
import { notificationController } from "./controllers/notificationControllers.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    service: "Notification Service",
    status: "running",
    version: "1.0.0"
  });
});

// API Routes
app.post("/api/notifications/direct", notificationController.sendDirectNotification);
app.post("/api/notifications/broadcast", notificationController.sendBroadcastNotification);

const emptyResponse = async (req, res) => {
  res.json({});
};

app.get("/health", emptyResponse);
app.get("/ready", emptyResponse);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, async () => {
  console.log(`Notification Service running on port ${PORT}`);

  try {
    // Initialize RabbitMQ connection
    await connectRabbitMQ();
    console.log("RabbitMQ connection established");

    // gRPC server ya se inicializa automáticamente
  } catch (error) {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  }
});