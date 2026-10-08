import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, XCircle } from 'lucide-react'
import { submitContactMessage } from '../services/contactService'

interface ContactFormProps {
  darkMode?: boolean
}

export default function ContactForm({ darkMode = true }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to save your message. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`p-6 rounded-xl relative ${
        darkMode
          ? 'stats-card'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
      onSubmit={handleSubmit}
    >
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 border rounded-lg flex items-start gap-3 ${
              darkMode
                ? 'bg-teal-500/20 border-teal-500'
                : 'bg-green-50 border-green-500'
            }`}
          >
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              darkMode ? 'text-teal-400' : 'text-green-600'
            }`} />
            <div>
              <p className={`font-semibold ${
                darkMode ? 'text-teal-400' : 'text-green-700'
              }`}>Message sent successfully!</p>
              <p className={`text-sm mt-1 ${
                darkMode ? 'text-teal-300' : 'text-green-600'
              }`}>
                Thanks for reaching out. I'll get back to you within 24 hours.
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 border rounded-lg flex items-start gap-3 ${
              darkMode
                ? 'bg-red-500/20 border-red-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <XCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`} />
            <div>
              <p className={`font-semibold ${
                darkMode ? 'text-red-400' : 'text-red-700'
              }`}>Failed to send message</p>
              <p className={`text-sm mt-1 ${
                darkMode ? 'text-red-300' : 'text-red-600'
              }`}>{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>NAME</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full px-4 py-3 border rounded-lg focus:border-teal-500 transition-colors ${
              darkMode
                ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:border-teal-500 transition-colors ${
              darkMode
                ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MESSAGE</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Tell me about your project..."
            className={`w-full px-4 py-3 border rounded-lg focus:border-teal-500 transition-colors resize-none ${
              darkMode
                ? 'bg-navy-700 border-navy-600 text-gray-100 placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
}
