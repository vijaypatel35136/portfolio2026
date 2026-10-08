const ADMIN_TOKEN_KEY = 'portfolio_admin_token'

/**
 * Login by calling the Express backend /api/auth/login.
 * The backend verifies email + bcrypt-hashed password against the admin table.
 */
export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    })

    if (!res.ok) {
      return false
    }

    const data = await res.json()
    if (data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      return true
    }
    return false
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
