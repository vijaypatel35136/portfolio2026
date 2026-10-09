import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
  { name: 'Contact',    href: '#contact',    id: 'contact' },
]

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection,  setActiveSection]  = useState('hero')

  /* ── Scroll position handler for active section & navbar background ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      // Check if user is near bottom of the page -> activate contact
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

  /* ── Listen to manual section change events ── */
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      if (event.detail) {
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
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(targetId)
      window.dispatchEvent(new CustomEvent('sectionChange', { detail: targetId }))
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Vijay Portfolio Home">
          <span
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{ background: 'var(--teal-500)', boxShadow: '0 0 8px var(--teal-500)' }}
          />
          <span
            className="font-heading text-xl font-bold tracking-tight"
            style={{ color: 'var(--ink-100)' }}
          >
            Vijay.
          </span>
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href, link.id)
                }}
                className={`navbar-link ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? 'var(--teal-500)' : 'var(--ink-300)',
                }}
              >
                {link.name}
              </a>
            )
          })}
        </div>

        {/* ── Desktop Theme Toggle ── */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* ── Mobile Controls ── */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--ink-500)', background: 'var(--bg-panel)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: 'var(--bg-panel)',
            borderColor: 'var(--border-line)',
          }}
        >
          <nav className="flex flex-col py-4 px-6 gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="py-3 px-3 rounded-lg font-medium text-base transition-colors"
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
                </a>
              )
            })}
            <div
              className="mt-4 pt-4 flex items-center gap-4"
              style={{ borderTop: '1px solid var(--border-line)' }}
            >
              <Link
                to="/vijay_dev"
                className="mono text-sm transition-colors"
                style={{ color: 'var(--ink-700)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                /vijay_dev
              </Link>
            </div>
          </nav>
        </div>
      )}
    </nav>
  )
}