import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.ts'
import profileRoutes from './routes/profile.ts'
import skillsRoutes from './routes/skills.ts'
import experienceRoutes from './routes/experience.ts'
import projectsRoutes from './routes/projects.ts'
import educationRoutes from './routes/education.ts'
import contactRoutes from './routes/contact.ts'
import adminRoutes from './routes/admin.ts'
import uploadRoutes from './routes/upload.ts'
import resumesRoutes from './routes/resumes.ts'
import { initDatabase } from './db/database.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
// Increase payload size limit for file uploads (10MB for JSON/URL-encoded data)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Disable caching for all API routes
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Surrogate-Control', 'no-store')
  next()
})

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/resumes', resumesRoutes)

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../dist')))

// Handle SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  }
})

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to initialize database:', error)
  console.log('Starting server without database initialization...')
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})