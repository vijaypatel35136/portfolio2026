import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const isSuccess = type === 'success'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 350)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const dismiss = () => {
    setIsVisible(false)
    setTimeout(onClose, 350)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          role="alert"
          aria-live="assertive"
          className="toast flex items-center gap-3 px-5 py-3.5 max-w-sm"
          style={{
            borderLeftWidth: 3,
            borderLeftColor: isSuccess ? 'var(--color-success)' : 'var(--color-error)',
          }}
        >
          {isSuccess ? (
            <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          ) : (
            <XCircle size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
          )}
          <span className="flex-1 text-sm font-medium" style={{ color: 'var(--ink-100)' }}>
            {message}
          </span>
          <button
            onClick={dismiss}
            className="ml-1 rounded transition-colors p-0.5"
            style={{ color: 'var(--ink-500)' }}
            aria-label="Dismiss notification"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-100)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-500)')}
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-6 right-5 z-50 flex flex-col gap-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
