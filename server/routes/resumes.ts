import { Router } from 'express'
import multer from 'multer'
import { queryAll, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'
import { uploadFile, deleteFile, initializeBucket } from '../services/supabaseStorage.js'

const router = Router()

// Initialize Supabase Storage bucket on startup
initializeBucket()

// Configure multer for memory storage (we'll upload to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed for resumes'))
    }
  }
})

// Get all resumes
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const resumes = await queryAll('SELECT * FROM resumes ORDER BY is_active DESC, uploaded_at DESC')
    res.json(resumes)
  } catch (error) {
    console.error('Fetch resumes error:', error)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

// Upload new resume
router.post('/upload', authenticateToken, upload.single('resume'), async (req: AuthenticatedRequest, res) => {
  try {
    console.log('📥 Resume upload request received')
    
    if (!req.file) {
      console.log('❌ No file in request')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('📄 File details:')
    console.log('   - Original name:', req.file.originalname)
    console.log('   - Size:', req.file.size, 'bytes')
    console.log('   - MIME type:', req.file.mimetype)

    // Upload to Supabase Storage
    console.log('📤 Uploading to Supabase Storage...')
    const uploadResult = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      'resumes'
    )
    console.log('✅ Upload successful:', uploadResult)

    // Save to database
    console.log('💾 Saving to database...')
    const result = await run(`
      INSERT INTO resumes (filename, original_name, file_path, public_url, file_size, is_active)
      VALUES ($1, $2, $3, $4, $5, false)
    `, [
      uploadResult.filename,
      req.file.originalname,
      uploadResult.path,
      uploadResult.publicUrl,
      req.file.size
    ])
    console.log('✅ Saved to database')

    res.json({
      success: true,
      id: result.lastInsertRowid,
      ...uploadResult,
      size: req.file.size
    })
  } catch (error: any) {
    console.error('❌ Upload resume error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(500).json({ error: error.message || 'Failed to upload resume' })
  }
})

// Set active resume
router.put('/:id/activate', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    // Deactivate all resumes
    await run('UPDATE resumes SET is_active = false')

    // Activate the selected one
    await run('UPDATE resumes SET is_active = true WHERE id = $1', [id])

    // Update profile with active resume URL
    const activeResume = await queryAll('SELECT public_url FROM resumes WHERE id = $1', [id])
    if (activeResume.length > 0) {
      await run('UPDATE profile SET resume_pdf = $1 WHERE id = 1', [activeResume[0].public_url])
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Activate resume error:', error)
    res.status(500).json({ error: 'Failed to activate resume' })
  }
})

// Delete resume
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    // Get resume info
    const resumes = await queryAll('SELECT file_path, is_active FROM resumes WHERE id = $1', [id])
    
    if (resumes.length === 0) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const resume = resumes[0]

    // Delete from Supabase Storage
    try {
      await deleteFile(resume.file_path)
    } catch (storageError) {
      console.error('Storage delete error:', storageError)
      // Continue even if storage delete fails
    }

    // Delete from database
    await run('DELETE FROM resumes WHERE id = $1', [id])

    // If this was the active resume, clear it from profile
    if (resume.is_active) {
      await run('UPDATE profile SET resume_pdf = NULL WHERE id = 1')
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Delete resume error:', error)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

// Get active resume
router.get('/active', async (req, res) => {
  try {
    const resumes = await queryAll('SELECT * FROM resumes WHERE is_active = true LIMIT 1')
    res.json(resumes.length > 0 ? resumes[0] : null)
  } catch (error) {
    console.error('Fetch active resume error:', error)
    res.status(500).json({ error: 'Failed to fetch active resume' })
  }
})

export default router
