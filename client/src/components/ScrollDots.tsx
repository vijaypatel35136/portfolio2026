import { useState, useEffect, useRef } from 'react'

const sections = [
  { id: 'hero',       label: 'Intro' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Work' },
  { id: 'education',  label: 'Education' },
  { id: 'contact',    label: 'Contact' },
]

/** A section becomes "current" once its top edge passes this line (px from viewport top). */
const ACTIVE_LINE = 200
/** Within this many px of the page top, the first section is always active. */
const TOP_ZONE = 100
/** How long to ignore scroll-spy after a click, so smooth scrolling doesn't flicker through sections. */
const CLICK_LOCK_MS = 1000

interface ScrollDotsProps {
  darkMode?: boolean
}

export default function ScrollDots(_props: ScrollDotsProps) {
  // First dot ("Intro") is active by default
  const [activeSection, setActiveSection] = useState(sections[0].id)

  const lockUntilRef = useRef(0)

  /* ── Scroll position handler for side dots ── */
  useEffect(() => {
    const handleScroll = () => {
      // Ignore scroll-spy while a click-triggered smooth scroll is running
      if (Date.now() < lockUntilRef.current) return

      // Top of the page: first dot is always active
      if (window.scrollY < TOP_ZONE) {
        setActiveSection(sections[0].id)
        return
      }

      // Bottom of the page: last dot
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection(sections[sections.length - 1].id)
        return
      }

      // getBoundingClientRect is viewport-relative, so nesting/positioned parents don't matter
      let current = sections[0].id
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Listen for manual sectionChange custom events (e.g. from Navbar) ── */
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      if (event.detail) {
        lockUntilRef.current = Date.now() + CLICK_LOCK_MS
        setActiveSection(event.detail)
      }
    }

    window.addEventListener('sectionChange', handleSectionChange as EventListener)
    return () => window.removeEventListener('sectionChange', handleSectionChange as EventListener)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      lockUntilRef.current = Date.now() + CLICK_LOCK_MS
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
          className={`scroll-dot ${activeSection === section.id ? 'active' : ''}`}
          aria-label={`Scroll to ${section.label}`}
          aria-current={activeSection === section.id ? 'true' : undefined}
        >
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  )
}