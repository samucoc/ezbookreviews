import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Extendemos Request para incluir userId
export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido' })
    }

    // // Esperamos "Bearer <token>"
    // const parts = authHeader.split(' ')
    // if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //   return res.status(401).json({ message: 'Formato de token inválido' })
    // }

    // const token = parts[1]

    // // Verificamos token
    // const decoded = jwt.verify(token, JWT_SECRET) as any
    // if (!decoded.userId) {
    //   return res.status(401).json({ message: 'Token inválido' })
    // }

    // Agregamos userId al request
    //req.userId = decoded.userId
    next()
  } catch (err) {
    console.error('Error en authMiddleware:', err)
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
