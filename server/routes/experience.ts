import { Router } from 'express'
import { queryAll, queryOne, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all experience (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await queryAll('SELECT * FROM experience ORDER BY display_order')
    const formatted = experiences.map(exp => {
      let description = []
      try {
        description = exp.description ? JSON.parse(exp.description) : []
      } catch (e) {
        // If JSON parse fails, treat as plain text and wrap in array
        description = exp.description ? [exp.description] : []
      }
      return {
        ...exp,
        description,
        is_current: Boolean(exp.is_current)
      }
    })
    res.json(formatted)
  } catch (error) {
    console.error('Fetch experience error:', error)
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

// Add experience (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, company, location, start_date, end_date, description, is_current } = req.body
    
    // Get next display order
    const maxOrder = await queryOne('SELECT COALESCE(MAX(display_order), -1) as max_order FROM experience')
    
    const result = await run(`
      INSERT INTO experience (title, company, location, start_date, end_date, description, is_current, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [title, company, location, start_date, end_date, JSON.stringify(description), is_current, (maxOrder?.max_order || -1) + 1])
    
    res.json({ id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add experience error:', error)
    res.status(500).json({ error: 'Failed to add experience' })
  }
})

// Update experience (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { title, company, location, start_date, end_date, description, is_current } = req.body
    await run(`
      UPDATE experience SET 
        title = $1, company = $2, location = $3, start_date = $4, end_date = $5, 
        description = $6, is_current = $7
      WHERE id = $8
    `, [title, company, location, start_date, end_date, JSON.stringify(description), is_current, id])
    res.json({ success: true })
  } catch (error) {
    console.error('Update experience error:', error)
    res.status(500).json({ error: 'Failed to update experience' })
  }
})

// Delete experience (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await run('DELETE FROM experience WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete experience error:', error)
    res.status(500).json({ error: 'Failed to delete experience' })
  }
})

export default router
