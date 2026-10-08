import { ContactMessage } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function submitContactMessage(payload: {
  name: string
  email: string
  message: string
}): Promise<ContactMessage> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
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
      .update({ read: true })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw new Error('Failed to update message status')
  }
}
