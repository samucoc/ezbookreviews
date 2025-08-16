import { Request, Response } from "express";
import axios from "axios";
import Book from "../models/Book";

const SEARCH_HISTORY: string[] = [];

/**
 * GET /api/books/search?q=:nombre
 * Busca libros en OpenLibrary y revisa si ya están en la biblioteca
 */
export const searchBooks = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ message: "Debe ingresar un término de búsqueda" });

  try {
    // Guardamos búsqueda en historial (máx 5)
    SEARCH_HISTORY.unshift(query);
    if (SEARCH_HISTORY.length > 5) SEARCH_HISTORY.pop();

    // Buscamos en MongoDB usando título o autor
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } }
      ]
    }).limit(10); // limitar a 10 resultados

    // Formatear la respuesta (agregando URL portada si existe)
    const results = books.map(b => ({
      _id: b._id,
      title: b.title,
      author: b.author || "Desconocido",
      year: b.year,
      cover: b.coverBase64
        ? `/api/books/library/front-cover/${b._id}`
        : null
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error buscando libros en la biblioteca", error: err });
  }
};

/**
 * GET /api/books/last-search/
 * Últimas 5 búsquedas del usuario
 */
export const getLastSearches = (req: Request, res: Response) => {
  res.json(SEARCH_HISTORY);
};

/**
 * POST /api/books/my-library
 * Guarda un libro en Mongo con su portada en base64
 */
export const addBookToLibrary = async (req: Request, res: Response) => {
  try {
    const { title, author, year, review, rating, coverBase64, coverId } = req.body;
    const newBook = new Book({ title, author, year, review, rating, coverBase64, coverId });
    await newBook.save();
    res.json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Error guardando libro", error: err });
  }
};

/**
 * GET /api/books/my-library/:id
 * Obtiene información de un libro guardado
 */
export const getBookFromLibrary = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Libro no encontrado" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo libro", error: err });
  }
};

/**
 * PUT /api/books/my-library/:id
 * Actualiza review y calificación
 */
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { review, rating } = req.body;
    const updated = await Book.findByIdAndUpdate(req.params.id, { review, rating }, { new: true });
    if (!updated) return res.status(404).json({ message: "Libro no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando libro", error: err });
  }
};

/**
 * DELETE /api/books/my-library/:id
 * Elimina libro
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Libro no encontrado" });
    res.json({ message: "Libro eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando libro", error: err });
  }
};

/**
 * GET /api/books/my-library
 * Lista libros con filtros por título, autor o review
 */
export const listLibrary = async (req: Request, res: Response) => {
  try {
    const { title, author, withReview } = req.query;

    const filter: any = {};
    if (title) filter.title = new RegExp(title as string, "i");
    if (author) filter.author = new RegExp(author as string, "i");
    if (withReview === "true") filter.review = { $exists: true, $ne: "" };

    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error listando libros", error: err });
  }
};

/**
 * GET /api/books/library/front-cover/:id
 * Devuelve la portada en base64
 */
export const getFrontCover = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.coverBase64) return res.status(404).json({ message: "Portada no encontrada" });

    res.contentType("image/png");
    const img = Buffer.from(book.coverBase64, "base64");
    res.end(img);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo portada", error: err });
  }
};