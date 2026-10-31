import { Router } from 'express'
import { queryAll, queryOne, run } from '../db/database.js'
import { createClient } from '@supabase/supabase-js'
import { sendContactNotification } from '../services/emailService.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

// Create Supabase client for delete operations (only if credentials are available)
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase client initialized for contact routes')
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err)
  }
} else {
  console.warn('⚠️ Supabase credentials missing in .env. Delete operations will use local database.')
}

const router = Router()

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    let savedMessage

    // Try Supabase first if available
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert({ name, email, subject: subject || '', message })
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return res.status(500).json({ error: 'Failed to submit message' })
      }
      savedMessage = data
      console.log('✅ Message saved to Supabase')
    } else {
      // Fallback to local database
      const result = await run(
        'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        [name, email, subject || '', message]
      )
      savedMessage = { id: result.lastInsertRowid }
      console.log('✅ Message saved to local database')
    }

    // Send email notification to admin
    try {
      await sendContactNotification({ name, email, message })
    } catch (emailError) {
      console.error('Email notification failed (message still saved):', emailError)
      // Don't fail the request if email fails
    }

    res.json({ success: true, data: savedMessage })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to submit message' })
  }
})

// Get all messages (admin only)
router.get('/', async (req, res) => {
  try {
    let messages

    // Try Supabase first if available
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error)
        return res.status(500).json({ error: 'Failed to fetch messages' })
      }
      messages = data || []
    } else {
      // Fallback to local database
      messages = await queryAll('SELECT * FROM messages ORDER BY created_at DESC')
    }

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

    // Try Supabase first if available
    if (supabase) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        return res.status(500).json({ error: 'Failed to mark message as read' })
      }
    } else {
      // Fallback to local database
      await run('UPDATE messages SET is_read = true WHERE id = $1', [id])
    }

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
    console.log('Server: Deleting message with ID:', id)

    // Try Supabase first if available
    if (supabase) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        return res.status(500).json({ error: 'Failed to delete message' })
      }

      console.log('Server: Message deleted successfully via Supabase')
      res.json({ success: true })
    } else {
      // Fallback to local database
      await run('DELETE FROM messages WHERE id = $1', [id])
      console.log('Server: Message deleted successfully via local database')
      res.json({ success: true })
    }
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
})

export default router
