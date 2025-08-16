import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db'
import bookRoutes from './routes/book.route'
import authRoutes from './routes/auth.route'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)      // <-- rutas de registro/login
app.use('/api/books', bookRoutes)     // <-- rutas de libros

export default app