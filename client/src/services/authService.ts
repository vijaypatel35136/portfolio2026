import { supabase } from '../lib/supabase'

const ADMIN_TOKEN_KEY = 'portfolio_admin_token'

/**
 * Login by checking credentials against Supabase admin table.
 * For GitHub Pages deployment without backend, we use Supabase directly.
 */
export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  try {
    // Check admin credentials in Supabase
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .eq('password', pass) // Note: In production, use hashed passwords
      .single()

    if (error || !data) {
      return false
    }

    // Create a simple token for session
    const token = btoa(`${email}:${Date.now()}`)
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    return true
  } catch (err) {
    console.error('Login error:', err)
    return false
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAdminAuthenticated(): boolean {
  return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY))
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}
