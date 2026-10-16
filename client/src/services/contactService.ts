import { ContactMessage } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function submitContactMessage(payload: {
  name: string
  email: string
  message: string
}): Promise<ContactMessage> {
  try {
    // First, save the message to the database
    const { data, error } = await supabase
      .from('messages')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    // Then, send email notification via Edge Function
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const functionUrl = `${supabaseUrl}/functions/v1/send-contact-email`

      await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (emailError) {
      // Log email error but don't fail the whole submission
      console.error('Email notification failed (message still saved):', emailError)
    }

    return data
  } catch (error) {
    console.error('Error submitting message:', error)
    throw new Error('Failed to send message')
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages')
  }
}

export async function markMessageAsRead(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw new Error('Failed to update message status')
  }
}

export async function deleteMessage(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting message:', error)
    throw new Error('Failed to delete message')
  }
}
