import { Router } from 'express'
import { queryAll, queryOne, run } from '../db/database.js'

const router = Router()

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const result = await run(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject || '', message]
    )
    
    res.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to submit message' })
  }
})

// Get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await queryAll('SELECT * FROM messages ORDER BY created_at DESC')
    
    const formatted = messages.map((msg: any) => ({
      ...msg,
      is_read: Boolean(msg.is_read)
    }))
    res.json(formatted)
  } catch (error) {
    console.error('Fetch messages error:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Get unread count (admin only)
router.get('/unread-count', async (req, res) => {
  try {
    const result = await queryOne('SELECT COUNT(*) as count FROM messages WHERE is_read = false')
    res.json({ count: parseInt(result?.count || 0) })
  } catch (error) {
    console.error('Fetch unread count error:', error)
    res.status(500).json({ error: 'Failed to fetch unread count' })
  }
})

// Mark message as read (admin only)
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params
    await run('UPDATE messages SET is_read = true WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ error: 'Failed to mark message as read' })
  }
})

// Delete message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await run('DELETE FROM messages WHERE id = $1', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
})

export default router
