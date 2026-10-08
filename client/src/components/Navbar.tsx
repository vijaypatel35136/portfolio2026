import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail)
    }

    window.addEventListener('sectionChange', handleSectionChange as EventListener)
    return () => window.removeEventListener('sectionChange', handleSectionChange as EventListener)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-3 h-3 bg-teal-500 rounded-full group-hover:animate-pulse" />
          <span className="font-heading text-xl font-bold tracking-tight">Vijay.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href)
              }}
              className={`text-sm transition-colors duration-200 ${
                activeSection === link.href.substring(1)
                  ? 'text-teal-400 font-medium'
                  : 'text-gray-400 hover:text-teal-400'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-400 hover:text-teal-400 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link 
            to="/admin"
            className="mono text-xs text-gray-500 hover:text-teal-400 transition-colors border border-navy-700 px-3 py-1.5 rounded"
          >
            /admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-navy-900 border-t border-navy-700">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                }}
                className={`text-lg transition-colors ${
                  activeSection === link.href.substring(1)
                    ? 'text-teal-400 font-medium'
                    : 'text-gray-300 hover:text-teal-400'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-navy-700">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-teal-400"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link 
                to="/admin"
                className="mono text-sm text-gray-500 hover:text-teal-400"
              >
                /admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}