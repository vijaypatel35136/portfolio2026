import { Experience } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function getExperiences(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching experience:', error)
    throw new Error('Failed to load experience records')
  }
}

export async function createExperience(exp: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .insert(exp)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating experience:', error)
    throw new Error('Failed to add experience entry')
  }
}

export async function updateExperience(id: number, exp: Partial<Experience>): Promise<Experience> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .update(exp)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating experience:', error)
    throw new Error('Failed to update experience entry')
  }
}

export async function deleteExperience(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting experience:', error)
    throw new Error('Failed to delete experience entry')
  }
}
