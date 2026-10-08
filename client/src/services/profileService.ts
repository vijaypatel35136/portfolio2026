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
    // First, get the existing profile to obtain its ID
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profile')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    // Then update using the ID
    const { data, error } = await supabase
      .from('profile')
      .update(profileData)
      .eq('id', existingProfile.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }
}
