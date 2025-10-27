import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  countInStock: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
