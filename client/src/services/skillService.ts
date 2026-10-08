import { Skill } from '../types/database.types'

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch('/api/skills')
    if (!response.ok) {
      throw new Error('Failed to load skills')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching skills:', error)
    throw new Error('Failed to load skills')
  }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(skill),
    })

    if (!response.ok) {
      throw new Error('Failed to add skill')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating skill:', error)
    throw new Error('Failed to add skill')
  }
}

export async function deleteSkill(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete skill')
    }
  } catch (error) {
    console.error('Error deleting skill:', error)
    throw new Error('Failed to delete skill')
  }
}
