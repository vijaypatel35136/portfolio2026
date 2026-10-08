import { Experience } from '../types/database.types'

export async function getExperiences(): Promise<Experience[]> {
  try {
    const response = await fetch('/api/experience')
    if (!response.ok) {
      throw new Error('Failed to load experience records')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching experience:', error)
    throw new Error('Failed to load experience records')
  }
}

export async function createExperience(exp: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(exp),
    })

    if (!response.ok) {
      throw new Error('Failed to add experience entry')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating experience:', error)
    throw new Error('Failed to add experience entry')
  }
}

export async function updateExperience(id: number, exp: Partial<Experience>): Promise<Experience> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(exp),
    })

    if (!response.ok) {
      throw new Error('Failed to update experience entry')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating experience:', error)
    throw new Error('Failed to update experience entry')
  }
}

export async function deleteExperience(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/experience/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete experience entry')
    }
  } catch (error) {
    console.error('Error deleting experience:', error)
    throw new Error('Failed to delete experience entry')
  }
}
