import { Router } from 'express'
import { queryAll, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await queryAll('SELECT * FROM skills ORDER BY category, display_order')
    res.json(skills)
  } catch (error) {
    console.error('Fetch skills error:', error)
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// Add skill (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { category, skill } = req.body
    const result = await run(
      'INSERT INTO skills (category, skill) VALUES ($1, $2)',
      [category, skill]
    )
    res.json({ id: result.lastInsertRowid, category, skill })
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ error: 'Failed to add skill' })
  }
})

// Update skill (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { category, skill } = req.body
    await run(
      'UPDATE skills SET category = $1, skill = $2 WHERE id = $3',
      [category, skill, id]
    )
    res.json({ success: true })
  } catch (error) {
    console.error('Update skill error:', error)
    res.status(500).json({ error: 'Failed to update skill' })
  }
})

// Delete skill (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await run('DELETE FROM skills WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete skill error:', error)
    res.status(500).json({ error: 'Failed to delete skill' })
  }
})

export default router
