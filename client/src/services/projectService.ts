import { Project } from '../types/database.types'

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects')
    if (!response.ok) {
      throw new Error('Failed to load projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to load projects')
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects/featured')
    if (!response.ok) {
      throw new Error('Failed to load featured projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    throw new Error('Failed to load featured projects')
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error('Failed to create project')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

export async function updateProject(id: number, project: Partial<Project>): Promise<Project> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error('Failed to update project')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating project:', error)
    throw new Error('Failed to update project')
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete project')
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}
