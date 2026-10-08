import { Skill } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching skills:', error)
    throw new Error('Failed to load skills')
  }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating skill:', error)
    throw new Error('Failed to add skill')
  }
}

export async function deleteSkill(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting skill:', error)
    throw new Error('Failed to delete skill')
  }
}
