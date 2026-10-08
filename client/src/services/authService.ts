import { supabase } from '../lib/supabase'

const ADMIN_TOKEN_KEY = 'portfolio_admin_token'

/**
 * Login by checking credentials against Supabase admin table.
 * Falls back to hardcoded credentials for testing if Supabase fails.
 */
export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  try {
    // First try Supabase admin table
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .eq('password', pass)
      .single()

    if (data && !error) {
      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      return true
    }

    // Fallback: Check hardcoded credentials for testing
    if (email === 'admin@vijay.dev' && pass === 'admin123') {
      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      return true
    }

    return false
  } catch (err) {
    console.error('Login error:', err)

    // Fallback to hardcoded credentials if Supabase fails
    if (email === 'admin@vijay.dev' && pass === 'admin123') {
      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      return true
    }

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
