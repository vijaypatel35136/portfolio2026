import { Router } from 'express'
import { queryAll, queryOne, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all education (public)
router.get('/', async (req, res) => {
  try {
    const education = await queryAll('SELECT * FROM education ORDER BY display_order')
    res.json(education)
  } catch (error) {
    console.error('Fetch education error:', error)
    res.status(500).json({ error: 'Failed to fetch education' })
  }
})

// Add education (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { degree, institution, location, start_date, end_date, description } = req.body
    
    // Get next display order
    const maxOrder = await queryOne('SELECT COALESCE(MAX(display_order), -1) as max_order FROM education')
    
    const result = await run(`
      INSERT INTO education (degree, institution, location, start_date, end_date, description, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [degree, institution, location, start_date, end_date, description, (maxOrder?.max_order || -1) + 1])
    
    res.json({ id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add education error:', error)
    res.status(500).json({ error: 'Failed to add education' })
  }
})

// Update education (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { degree, institution, location, start_date, end_date, description } = req.body
    await run(`
      UPDATE education SET 
        degree = $1, institution = $2, location = $3, start_date = $4, end_date = $5, description = $6
      WHERE id = $7
    `, [degree, institution, location, start_date, end_date, description, id])
    res.json({ success: true })
  } catch (error) {
    console.error('Update education error:', error)
    res.status(500).json({ error: 'Failed to update education' })
  }
})

// Delete education (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await run('DELETE FROM education WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete education error:', error)
    res.status(500).json({ error: 'Failed to delete education' })
  }
})

export default router
