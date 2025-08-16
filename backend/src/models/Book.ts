import { Schema, model, Types } from "mongoose";

const bookSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true }, // asociamos usuario
  title: { type: String, required: true },
  author: String,
  year: Number,
  review: String,
  rating: Number,
  coverId: String,       // ID portada (OpenLibrary)
  coverBase64: String,   // Imagen portada guardada en base64
}, { timestamps: true });

export default model("Book", bookSchema);
