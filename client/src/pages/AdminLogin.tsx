import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Shield, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { loginAdmin } from '../services/authService'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [error,         setError]         = useState('')
  const [emailError,    setEmailError]    = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading,       setLoading]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setEmailError(''); setPasswordError('')
    setLoading(true)

    let hasError = false
    if (!email)    { setEmailError('Username is required');    hasError = true }
    if (!password) { setPasswordError('Password is required'); hasError = true }
    if (hasError)  { setLoading(false); return }

    try {
      const success = await loginAdmin(email, password)
      if (success) {
        navigate('/vijay_dev/dashboard')
      } else {
        setError('Invalid credentials. Check your username and password.')
        setEmailError('Invalid username')
        setPasswordError('Invalid password')
        setLoading(false)
      }
    } catch {
      setError('Connection error. Make sure the server is running.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-blob glow-teal  w-[500px] h-[500px] -top-48  -left-48" />
        <div className="glow-blob glow-amber w-[400px] h-[400px] -bottom-24 -right-24" />
      </div>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-5 py-8"
      >
        {/* Icon badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center"
            style={{
              width: 72, height: 72,
              background: 'var(--teal-100)',
              border: '1.5px solid var(--teal-200)',
              boxShadow: 'var(--shadow-teal)',
            }}
          >
            <Shield size={32} style={{ color: 'var(--teal-500)' }} />
          </div>
        </motion.div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="font-heading text-3xl font-bold mb-2"
            style={{ color: 'var(--ink-100)' }}
          >
            Admin Panel
          </h1>
          <p className="text-sm" style={{ color: 'var(--ink-500)' }}>
            Secure access to portfolio management
          </p>
        </div>

        {/* Form card */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          className="panel p-8 space-y-5"
          noValidate
        >
          {/* Global error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="contact-error-alert flex items-center gap-2 p-3 text-sm overflow-hidden"
            >
              {error}
            </motion.div>
          )}

          {/* Username */}
          <div>
            <label
              className="admin-label"
              htmlFor="admin-username"
            >
              Username
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--ink-700)' }}
              />
              <input
                id="admin-username"
                type="text"
                placeholder="Enter your username"
                value={email}
                autoComplete="username"
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                className="admin-input pl-10"
                style={emailError ? { borderColor: 'var(--color-error)', boxShadow: '0 0 0 3px var(--color-error-bg)' } : {}}
                required
              />
            </div>
            {emailError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs"
                style={{ color: 'var(--color-error)' }}
              >
                {emailError}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="admin-label"
              htmlFor="admin-password"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--ink-700)' }}
              />
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                className="admin-input pl-10"
                style={passwordError ? { borderColor: 'var(--color-error)', boxShadow: '0 0 0 3px var(--color-error-bg)' } : {}}
                required
              />
            </div>
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs"
                style={{ color: 'var(--color-error)' }}
              >
                {passwordError}
              </motion.p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-primary cta-glow w-full py-3.5 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={17} />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}