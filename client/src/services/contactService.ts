import { ContactMessage } from '../types/database.types'

export async function submitContactMessage(payload: {
  name: string
  email: string
  message: string
}): Promise<ContactMessage> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting message:', error)
    throw new Error('Failed to send message')
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/contact', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch contact messages')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages')
  }
}

export async function markMessageAsRead(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/contact/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to update message status')
    }
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw new Error('Failed to update message status')
  }
}
