import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero',       label: 'Intro' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Work' },
  { id: 'education',  label: 'Education' },
  { id: 'contact',    label: 'Contact' },
]

interface ScrollDotsProps {
  darkMode?: boolean
}

export default function ScrollDots(_props: ScrollDotsProps) {
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
          aria-label={`Scroll to ${section.id}`}
        >
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  )
}