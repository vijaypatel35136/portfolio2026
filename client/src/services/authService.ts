import { supabase } from '../lib/supabase'

const ADMIN_TOKEN_KEY = 'portfolio_admin_token'

/**
 * Login by checking credentials against Supabase admin table.
 * Falls back to hardcoded credentials for testing if Supabase fails.
 */
export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
        return true
      }
    }

    // Fallback if local backend is down or static client preview mode
    if (email === 'admin@vijay.dev' && pass === 'admin123') {
      const mockToken = btoa(JSON.stringify({ id: 1, email }))
      localStorage.setItem(ADMIN_TOKEN_KEY, mockToken)
      return true
    }

    return false
  } catch (err) {
    console.error('Login error:', err)
    if (email === 'admin@vijay.dev' && pass === 'admin123') {
      const mockToken = btoa(JSON.stringify({ id: 1, email }))
      localStorage.setItem(ADMIN_TOKEN_KEY, mockToken)
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
