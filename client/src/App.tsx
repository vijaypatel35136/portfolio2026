import { useState, useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100 dark">
      <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  )
}

export default App