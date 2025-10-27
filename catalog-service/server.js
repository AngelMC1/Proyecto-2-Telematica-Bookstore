import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Catalog Service is running...");
});

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Catalog Service running on port ${PORT}`));
