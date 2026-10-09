import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

interface ThemeToggleProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={() => setDarkMode(!darkMode)}
      className="theme-toggle"
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={darkMode}
      role="switch"
    >
      <motion.div
        className="theme-toggle-thumb"
        animate={{ x: darkMode ? 26 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{
          background: darkMode ? 'var(--teal-500)' : 'var(--amber-400)',
        }}
      >
        <motion.div
          key={darkMode ? 'moon' : 'sun'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.15 }}
        >
          {darkMode ? (
            <Moon size={11} color="var(--ink-on-primary)" strokeWidth={2.5} />
          ) : (
            <Sun size={11} color="var(--ink-on-primary)" strokeWidth={2.5} />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
