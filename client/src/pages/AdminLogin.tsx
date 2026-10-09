import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Shield, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { loginAdmin } from '../services/authService'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')
    setLoading(true)

    // Validate fields
    let hasError = false

    if (!email) {
      setEmailError('Username is required')
      hasError = true
    }

    if (!password) {
      setPasswordError('Password is required')
      hasError = true
    }

    if (hasError) {
      setLoading(false)
      return
    }

    try {
      const success = await loginAdmin(email, password)
      if (success) {
        navigate('/vijay_dev/dashboard')
      } else {
        setError('Invalid credentials. Check your email and password.')
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
    <div className="min-h-screen bg-navy-900 flex items-center justify-center relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="glow-blob glow-blue w-[600px] h-[600px] -top-64 -left-64" />
        <div className="glow-blob glow-gold w-[500px] h-[500px] -bottom-32 -right-32" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 grid-bg opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center border border-teal-500/30 backdrop-blur-sm">
            <Shield className="w-10 h-10 text-teal-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Secure access to portfolio management</p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit} 
          className="bg-navy-800/50 backdrop-blur-sm p-8 rounded-2xl border border-navy-700/50 shadow-2xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Enter Your Username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-navy-700/50 border rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                    emailError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-navy-600/50 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  required
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {emailError}
                </motion.p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-navy-700/50 border rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                    passwordError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-navy-600/50 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  required
                />
              </div>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {passwordError}
                </motion.p>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}