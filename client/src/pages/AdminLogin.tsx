import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, ArrowRight, Shield, User, ArrowLeft, Eye, EyeOff } from 'lucide-react'
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
  const [showPw,        setShowPw]        = useState(false)

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
    <div className="auth-shell">
      {/* ── Brand side ── */}
      <aside className="auth-brand">
        <Link to="/" className="flex items-center gap-2.5 w-fit group" aria-label="Back to portfolio">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--teal-500)', boxShadow: '0 0 10px var(--teal-400)' }}
          />
          <span className="font-heading text-xl font-bold" style={{ color: 'var(--ink-100)' }}>
            Vijay<span style={{ color: 'var(--amber-400)' }}>.</span>
          </span>
        </Link>

        <div>
          <span className="eyebrow">control room</span>
          <h2 className="text-5xl xl:text-6xl font-bold mb-5" style={{ color: 'var(--ink-100)' }}>
            Run your <span className="gradient-text">portfolio</span> from one place.
          </h2>
          <p className="text-lg max-w-md" style={{ color: 'var(--ink-300)' }}>
            Update your profile, skills, projects and read new messages — changes go live on the site instantly.
          </p>

          <div className="panel mt-10 max-w-md overflow-hidden" style={{ padding: 0 }}>
            <div className="terminal-chrome">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-path">~/auth.log</span>
            </div>
            <div className="px-5 py-4" style={{ background: 'var(--bg-code)' }}>
              <p className="log-line"><b>[ok]</b> secure session ready</p>
              <p className="log-line"><b>[ok]</b> database connected</p>
              <p className="log-line"><em>[..]</em> waiting for credentials<span className="cursor-blink">▌</span></p>
            </div>
          </div>
        </div>

        <p className="mono text-xs" style={{ color: 'var(--ink-700)' }}>© 2026 · Vijay Bhesaniya</p>
      </aside>

      {/* ── Form side ── */}
      <main className="auth-form-side">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: 'var(--ink-500)' }}
          >
            <ArrowLeft size={15} /> Back to site
          </Link>

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
            className="mb-6"
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 60, height: 60,
                background: 'var(--teal-100)',
                border: '1.5px solid var(--teal-200)',
                boxShadow: 'var(--shadow-teal)',
              }}
            >
              <Shield size={28} style={{ color: 'var(--teal-500)' }} />
            </div>
          </motion.div>

          <h1 className="font-heading text-4xl font-bold mb-2" style={{ color: 'var(--ink-100)' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--ink-500)' }}>
            Sign in to manage your portfolio content.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onSubmit={handleSubmit}
            className="panel p-7 md:p-8 space-y-5"
            noValidate
          >
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
              <label className="admin-label" htmlFor="admin-username">Username</label>
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
              <label className="admin-label" htmlFor="admin-password">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--ink-700)' }}
                />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                  className="admin-input pl-10 pr-11"
                  style={passwordError ? { borderColor: 'var(--color-error)', boxShadow: '0 0 0 3px var(--color-error-bg)' } : {}}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
                  style={{ color: 'var(--ink-500)' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                  <span
                    className="w-4 h-4 border-2 rounded-full animate-spin"
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
      </main>
    </div>
  )
}
