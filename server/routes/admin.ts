import { Router } from 'express'
import { queryOne } from '../db/database.js'

const router = Router()

// Get dashboard stats (admin only)
router.get('/stats', async (req, res) => {
  try {
    const projectsCount = await queryOne('SELECT COUNT(*) as count FROM projects')
    const messagesCount = await queryOne('SELECT COUNT(*) as count FROM messages')
    const unreadCount = await queryOne('SELECT COUNT(*) as count FROM messages WHERE is_read = false')
    const experienceCount = await queryOne('SELECT COUNT(*) as count FROM experience')
    
    res.json({
      totalProjects: parseInt(projectsCount?.count || 0),
      totalMessages: parseInt(messagesCount?.count || 0),
      unreadMessages: parseInt(unreadCount?.count || 0),
      totalExperience: parseInt(experienceCount?.count || 0)
    })
  } catch (error) {
    console.error('Fetch stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
