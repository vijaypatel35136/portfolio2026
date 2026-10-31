import { ContactMessage } from '../types/database.types'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function submitContactMessage(payload: {
  name: string
  email: string
  message: string
}): Promise<ContactMessage> {
  try {
    // Save message via server API to trigger email notification
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit message')
    }

    const result = await response.json()
    return result as ContactMessage
  } catch (error) {
    console.error('Error submitting message:', error)
    throw new Error('Failed to send message')
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const response = await fetch(`${API_URL}/api/contact`)
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages')
  }
}

export async function markMessageAsRead(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/contact/${id}/read`, {
      method: 'PUT',
    })
    if (!response.ok) {
      throw new Error('Failed to mark message as read')
    }
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw new Error('Failed to update message status')
  }
}

export async function deleteMessage(id: number): Promise<void> {
  try {
    console.log('Attempting to delete message with ID:', id)
    const response = await fetch(`${API_URL}/api/contact/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete message')
    }

    console.log('Message deleted successfully')
  } catch (error) {
    console.error('Error deleting message:', error)
    throw new Error('Failed to delete message')
  }
}
