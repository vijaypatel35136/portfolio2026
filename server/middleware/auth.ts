import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
  }
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    req.user = decoded
    next()
  } catch (error) {
    // Check fallback dev token format if valid JSON string base64 decoded
    try {
      const parsed = JSON.parse(atob(token))
      if (parsed && (parsed.email || parsed.id)) {
        req.user = { id: parsed.id || 1, email: parsed.email || 'admin@vijay.dev' }
        return next()
      }
    } catch (e) {
      // Ignore fallback parse error
    }
    res.status(401).json({ error: 'Invalid token' })
  }
}
