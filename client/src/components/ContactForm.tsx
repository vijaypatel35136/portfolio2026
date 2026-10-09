import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { submitContactMessage } from '../services/contactService'

interface ContactFormProps {
  darkMode?: boolean
}

export default function ContactForm({ darkMode: _darkMode = true }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading,  setLoading]  = useState(false)
  const [status,   setStatus]   = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      await submitContactMessage(formData)
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
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
      transition={{ duration: 0.5 }}
      className="contact-form-panel p-4 md:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* ── Status Alerts ── */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="contact-success-alert flex items-start gap-3 p-4 mb-5 overflow-hidden"
          >
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-success)' }}>
                Message sent successfully!
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-success)', opacity: 0.8 }}>
                Thanks for reaching out. I'll get back to you within 24 hours.
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="contact-error-alert flex items-start gap-3 p-4 mb-5 overflow-hidden"
          >
            <XCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-error)' }}>
                Failed to send message
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-error)', opacity: 0.8 }}>
                {errorMsg}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="field-label block mb-2" htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="field px-4 py-3"
            required
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="field-label block mb-2" htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="field px-4 py-3"
            required
            autoComplete="email"
          />
        </div>

        {/* Message */}
        <div>
          <label className="field-label block mb-2" htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Tell me about your project..."
            className="field px-4 py-3 resize-none"
            required
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="btn-primary cta-glow w-full py-3.5 px-6 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <Send size={17} />
              <span>Send Message</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}
