import { Education } from '../types/database.types'

export async function getEducation(): Promise<Education[]> {
  try {
    const response = await fetch('/api/education')
    if (!response.ok) {
      throw new Error('Failed to load education entries')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching education:', error)
    throw new Error('Failed to load education entries')
  }
}

export async function createEducation(edu: Omit<Education, 'id' | 'created_at'>): Promise<Education> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/education', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(edu),
    })

    if (!response.ok) {
      throw new Error('Failed to add education entry')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating education:', error)
    throw new Error('Failed to add education entry')
  }
}

export async function updateEducation(id: number, edu: Partial<Education>): Promise<Education> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/education/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(edu),
    })

    if (!response.ok) {
      throw new Error('Failed to update education entry')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating education:', error)
    throw new Error('Failed to update education entry')
  }
}

export async function deleteEducation(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/education/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete education entry')
    }
  } catch (error) {
    console.error('Error deleting education:', error)
    throw new Error('Failed to delete education entry')
  }
}
