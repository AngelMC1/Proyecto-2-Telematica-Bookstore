import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import userClient from "./grpc/client.js"
import { consumeUserEvents } from "./rabbitmq.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/catalog/user/:id", (req, res) => {
  const userId = req.params.id;
  userClient.GetUserById({ id: userId }, (err, user) => {
    if (err) {
      console.error("gRPC call error:", err);

      const status = err.code === grpc.status.NOT_FOUND ? 404 : 500;
      return res.status(status).json({ message: err.message || "gRPC error" });
    }
    return res.json(user);
  });
});

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Catalog Service running on port ${PORT}`));
await consumeUserEvents();

