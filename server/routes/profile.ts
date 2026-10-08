import { Router } from 'express'
import { queryOne, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get profile (public)
router.get('/', async (req, res) => {
  try {
    const profile = await queryOne('SELECT * FROM profile WHERE id = 1')
    
    if (profile) {
      try {
        profile.tagline_roles = JSON.parse(profile.tagline_roles || '[]')
      } catch {
        profile.tagline_roles = []
      }
      res.json(profile)
    } else {
      res.json(null)
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update profile (admin only)
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('📥 Profile update request body:', JSON.stringify(req.body, null, 2))
    
    const { name, tagline_roles, summary, profile_photo, resume_pdf, email, phone, linkedin, github, location, experience_years, projects_count, education } = req.body
    
    // Validate required fields
    if (!name || name.trim() === '') {
      console.log('❌ Validation failed: name is required')
      return res.status(400).json({ error: 'Name is required and cannot be empty' })
    }
    
    // Check if profile exists
    const existing = await queryOne('SELECT * FROM profile WHERE id = 1')
    
    if (existing) {
      console.log('✅ Updating existing profile...')
      await run(`
        UPDATE profile SET 
          name = $1, 
          tagline_roles = $2, 
          summary = $3,
          profile_photo = COALESCE($4, profile_photo),
          resume_pdf = COALESCE($5, resume_pdf),
          email = $6,
          phone = $7,
          linkedin = $8,
          github = $9,
          location = $10,
          experience_years = $11,
          projects_count = $12,
          education = $13,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        name.trim(),
        JSON.stringify(tagline_roles || []),
        summary || '',
        profile_photo || null,
        resume_pdf || null,
        email || '',
        phone || '',
        linkedin || '',
        github || '',
        location || '',
        experience_years || 0,
        projects_count || 0,
        education || ''
      ])
    } else {
      console.log('✅ Creating new profile...')
      await run(`
        INSERT INTO profile (id, name, tagline_roles, summary, profile_photo, resume_pdf, email, phone, linkedin, github, location, experience_years, projects_count, education)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        name.trim(),
        JSON.stringify(tagline_roles || []),
        summary || '',
        profile_photo || null,
        resume_pdf || null,
        email || '',
        phone || '',
        linkedin || '',
        github || '',
        location || '',
        experience_years || 0,
        projects_count || 0,
        education || ''
      ])
    }

    console.log('✅ Profile updated successfully')
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Error updating profile:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
