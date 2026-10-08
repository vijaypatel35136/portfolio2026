import { Router } from 'express'
import { queryAll, queryOne, run } from '../db/database.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await queryAll('SELECT * FROM projects ORDER BY is_featured DESC, display_order')
    const formatted = projects.map(proj => {
      let tech_stack = []
      if (proj.tech_stack) {
        if (typeof proj.tech_stack === 'string') {
          tech_stack = proj.tech_stack.split(', ')
        } else if (Array.isArray(proj.tech_stack)) {
          tech_stack = proj.tech_stack
        }
      }
      return {
        ...proj,
        tech_stack,
        is_featured: Boolean(proj.is_featured)
      }
    })
    res.json(formatted)
  } catch (error) {
    console.error('Fetch projects error:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Add project (admin only)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, url, description, tech_stack, category, thumbnail, is_featured } = req.body
    const techStackStr = Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack
    
    // Get next display order
    const maxOrder = await queryOne('SELECT COALESCE(MAX(display_order), -1) as max_order FROM projects')
    
    const result = await run(`
      INSERT INTO projects (name, url, description, tech_stack, category, thumbnail, is_featured, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [name, url, description, techStackStr, category || 'Shopify', thumbnail, is_featured, (maxOrder?.max_order || -1) + 1])
    
    res.json({ id: result.lastInsertRowid })
  } catch (error) {
    console.error('Add project error:', error)
    res.status(500).json({ error: 'Failed to add project' })
  }
})

// Update project (admin only)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { name, url, description, tech_stack, category, thumbnail, is_featured } = req.body
    const techStackStr = Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack
    await run(`
      UPDATE projects SET 
        name = $1, url = $2, description = $3, tech_stack = $4, category = $5,
        thumbnail = COALESCE($6, thumbnail), is_featured = $7
      WHERE id = $8
    `, [name, url, description, techStackStr, category, thumbnail, is_featured, id])
    res.json({ success: true })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    await run('DELETE FROM projects WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router
