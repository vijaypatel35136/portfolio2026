import { Profile } from '../types/database.types'
import { supabase } from '../lib/supabase'

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Failed to fetch profile details')
  }
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .update(profileData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }
}
