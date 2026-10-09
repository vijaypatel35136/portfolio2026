import { useState, useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark')  return true
      if (saved === 'light') return false
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
      html.style.colorScheme = 'light'
    }
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    } catch { /* ignore */ }
  }, [darkMode])

  /* Keep in sync with OS preference if no saved preference */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: 'var(--bg-void)',
        color: 'var(--ink-100)',
      }}
    >
      <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default App