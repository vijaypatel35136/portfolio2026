import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero', label: '01' },
  { id: 'about', label: '02' },
  { id: 'skills', label: '03' },
  { id: 'experience', label: '04' },
  { id: 'projects', label: '05' },
  { id: 'education', label: '06' },
  { id: 'contact', label: '07' },
]

export default function ScrollDots() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            // Dispatch custom event for other components to listen
            window.dispatchEvent(new CustomEvent('sectionChange', { detail: entry.target.id }))
          }
        })
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-10% 0px -60% 0px'
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
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
        />
      ))}
    </div>
  )
}