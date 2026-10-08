import { Profile } from '../types/database.types'

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await fetch('/api/profile')
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch profile')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Failed to fetch profile details')
  }
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }
}
