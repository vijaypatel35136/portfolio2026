import { Education } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function getEducation(): Promise<Education[]> {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching education:', error)
    throw new Error('Failed to load education entries')
  }
}

export async function createEducation(edu: Omit<Education, 'id' | 'created_at'>): Promise<Education> {
  try {
    const { data, error } = await supabase
      .from('education')
      .insert(edu)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating education:', error)
    throw new Error('Failed to add education entry')
  }
}

export async function updateEducation(id: number, edu: Partial<Education>): Promise<Education> {
  try {
    const { data, error } = await supabase
      .from('education')
      .update(edu)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating education:', error)
    throw new Error('Failed to update education entry')
  }
}

export async function deleteEducation(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting education:', error)
    throw new Error('Failed to delete education entry')
  }
}
