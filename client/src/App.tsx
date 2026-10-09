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

  /* Cursor spotlight: feeds --mx/--my to whichever .panel is under the pointer */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.('.panel') as HTMLElement | null
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{
        background: 'var(--bg-void)',
        color: 'var(--ink-100)',
      }}
    >
      {/* Shared atmosphere for every page */}
      <div className="aurora" aria-hidden>
        <i /><i /><i />
      </div>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" aria-hidden />
      <div className="fixed inset-0 noise pointer-events-none z-0" aria-hidden />

      <div className="relative z-10">
        <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  )
}

export default App