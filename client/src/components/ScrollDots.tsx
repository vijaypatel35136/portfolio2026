import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero',       label: '01' },
  { id: 'about',      label: '02' },
  { id: 'skills',     label: '03' },
  { id: 'experience', label: '04' },
  { id: 'projects',   label: '05' },
  { id: 'education',  label: '06' },
  { id: 'contact',    label: '07' },
]

interface ScrollDotsProps {
  darkMode?: boolean
}

export default function ScrollDots({ darkMode = true }: ScrollDotsProps) {
  const [activeSection, setActiveSection] = useState('hero')

  /* ── Scroll position handler for side dots ── */
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact')
        return
      }

      const scrollPosition = window.scrollY + 200
      const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact']

      let current = 'hero'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && scrollPosition >= el.offsetTop) {
          current = id
        }
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Listen for manual sectionChange custom events ── */
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      if (event.detail) {
        setActiveSection(event.detail)
      }
    }

    window.addEventListener('sectionChange', handleSectionChange as EventListener)
    return () => window.removeEventListener('sectionChange', handleSectionChange as EventListener)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
      window.dispatchEvent(new CustomEvent('sectionChange', { detail: id }))
    }
  }

  return (
    <div className="scroll-dots hidden lg:flex">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`scroll-dot ${
            activeSection === section.id ? 'active' : ''
          }`}
          style={{
            '--border-line': darkMode ? '#1c2740' : '#e5e7eb',
            '--teal-500': darkMode ? '#0e7c7b' : '#0d9488'
          } as React.CSSProperties}
          aria-label={`Scroll to ${section.id}`}
        />
      ))}
    </div>
  )
}