import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const navLinks = [
  { name: 'Home',       href: '#hero',       id: 'hero' },
  { name: 'About',      href: '#about',      id: 'about' },
  { name: 'Skills',     href: '#skills',     id: 'skills' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Projects',   href: '#projects',   id: 'projects' },
  { name: 'Education',  href: '#education',  id: 'education' },
  { name: 'Contact',    href: '#contact',    id: 'contact' },
]

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact']

/** A section becomes "current" once its top edge passes this line (px from viewport top). */
const ACTIVE_LINE = 220
/** Within this many px of the page top, the first section is always active. */
const TOP_ZONE = 100
/** How long to ignore scroll-spy after a click, so smooth scrolling doesn't flicker through sections. */
const CLICK_LOCK_MS = 1000

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // First link ("Home") is active by default
  const [activeSection,  setActiveSection]  = useState(SECTION_IDS[0])

  const lockUntilRef = useRef(0)

  /* Reading-progress bar */
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })

  /* ── Scroll position handler for active section & navbar shadow ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      // Ignore scroll-spy while a click-triggered smooth scroll is running
      if (Date.now() < lockUntilRef.current) return

      // Top of the page: Home is always active
      if (window.scrollY < TOP_ZONE) {
        setActiveSection(SECTION_IDS[0])
        return
      }

      // Bottom of the page: last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection(SECTION_IDS[SECTION_IDS.length - 1])
        return
      }

      // getBoundingClientRect is viewport-relative, so nesting/positioned parents don't matter
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Listen to manual section change events (e.g. from ScrollDots) ── */
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

  const scrollToSection = (href: string, id: string) => {
    const targetId = id || href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      lockUntilRef.current = Date.now() + CLICK_LOCK_MS
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(targetId)
      window.dispatchEvent(new CustomEvent('sectionChange', { detail: targetId }))
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden>
        <motion.span style={{ scaleX: progress }} />
      </div>

      <header className="nav-wrap">
        <nav className={`nav-pill ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Vijay Portfolio Home">
            <span
              className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
              style={{ background: 'var(--teal-500)', boxShadow: '0 0 10px var(--teal-400)' }}
            />
            <span className="font-heading text-lg font-bold tracking-tight" style={{ color: 'var(--ink-100)' }}>
              Vijay<span style={{ color: 'var(--amber-400)' }}>.</span>
            </span>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href, link.id)
                }}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                aria-current={activeSection === link.id ? 'true' : undefined}
              >
                {link.name}
              </a>
            ))}
          </div>

          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#contact', 'contact')
            }}
            className="nav-cta hidden sm:inline-flex"
          >
            Hire me <ArrowUpRight size={14} />
          </a>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2.5 rounded-full transition-colors"
            style={{ color: 'var(--ink-300)', background: 'var(--bg-panel-2)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* ── Mobile sheet ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="nav-sheet md:hidden"
            >
              <div className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className="py-3 px-4 rounded-2xl font-medium text-base transition-colors flex items-center justify-between"
                      style={{
                        color: isActive ? 'var(--teal-500)' : 'var(--ink-300)',
                        background: isActive ? 'var(--teal-100)' : 'transparent',
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(link.href, link.id)
                      }}
                    >
                      {link.name}
                      <ArrowUpRight size={15} style={{ opacity: 0.5 }} />
                    </a>
                  )
                })}
                <div className="mt-2 pt-3 px-4 flex items-center" style={{ borderTop: '1px solid var(--border-line)' }}>
                  <Link
                    to="/vijay_dev"
                    className="mono text-xs"
                    style={{ color: 'var(--ink-700)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    /vijay_dev
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}