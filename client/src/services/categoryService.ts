import { supabase } from '../lib/supabase'

export interface ProjectCategory {
  id: number
  name: string
  display_order: number
  created_at: string
}

export async function getCategories(): Promise<ProjectCategory[]> {
  try {
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to load categories')
  }
}

export async function createCategory(name: string, display_order: number): Promise<ProjectCategory> {
  try {
    const { data, error } = await supabase
      .from('project_categories')
      .insert({ name, display_order })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category')
  }
}

export async function updateCategory(id: number, name: string, display_order: number): Promise<ProjectCategory> {
  try {
    const { data, error } = await supabase
      .from('project_categories')
      .update({ name, display_order })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating category:', error)
    throw new Error('Failed to update category')
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('project_categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }
}
