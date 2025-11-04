import express from "express";
import Book from "../models/bookModel.js";

const router = express.Router();


router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});


router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro" });
  }
});

export default router;

