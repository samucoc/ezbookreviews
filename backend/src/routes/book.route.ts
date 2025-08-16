import { Router } from "express";
import {
  searchBooks,
  getLastSearches,
  addBookToLibrary,
  getBookFromLibrary,
  updateBook,
  deleteBook,
  listLibrary,
  getFrontCover
} from "../controllers/book.controller";
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Book from "../models/Book";

const router = Router();

// ---------------------
// BÚSQUEDAS
// ---------------------
router.get("/search", authMiddleware, searchBooks);
router.get("/last-search", authMiddleware, getLastSearches);

// ---------------------
// BIBLIOTECA
// Todos los endpoints usan userId del token
// ---------------------

// Agregar libro a la biblioteca
router.post("/my-library", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const newBook = new Book({ ...req.body, userId })
    await newBook.save()
    res.status(201).json(newBook)
  } catch (err) {
    res.status(500).json({ message: "Error agregando libro", error: err })
  }
})

// Listar biblioteca del usuario
router.get("/my-library", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const books = await Book.find({ userId })
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo biblioteca", error: err })
  }
})

// Obtener libro por ID
router.get("/my-library/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const book = await Book.findOne({ _id: req.params.id, userId })
    if (!book) return res.status(404).json({ message: "Libro no encontrado" })
    res.json(book)
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo libro", error: err })
  }
})

// Actualizar libro
router.put("/my-library/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const updated = await Book.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: "Libro no encontrado" })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: "Error actualizando libro", error: err })
  }
})

// Eliminar libro
router.delete("/my-library/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const deleted = await Book.findOneAndDelete({ _id: req.params.id, userId })
    if (!deleted) return res.status(404).json({ message: "Libro no encontrado" })
    res.json({ message: "Libro eliminado correctamente" })
  } catch (err) {
    res.status(500).json({ message: "Error eliminando libro", error: err })
  }
})

// Portada en base64
router.get("/library/front-cover/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const book = await Book.findOne({ _id: req.params.id, userId })
    if (!book || !book.coverBase64) return res.status(404).json({ message: "Portada no encontrada" })
    res.type('image/png').send(book.coverBase64)
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo portada", error: err })
  }
})

export default router
