import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { connectRabbitMQ } from "./rabbitmq.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("User Service is running...");
});

app.use("/api/users", userRoutes);

const emptyResponse = async (req, res) => {
  res.json({});
};

app.get("/health", emptyResponse);
app.get("/ready", emptyResponse);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
await connectRabbitMQ();

