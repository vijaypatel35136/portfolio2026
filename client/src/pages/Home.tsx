import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, Phone, Linkedin, Github, ExternalLink, ChevronUp, Terminal } from 'lucide-react'
import ContactForm from '../components/ContactForm'
import { getProfile } from '../services/profileService'
import { getSkills } from '../services/skillService'
import { getExperiences } from '../services/experienceService'
import { getProjects } from '../services/projectService'
import { getEducation } from '../services/educationService'

// Default fallback profile data when database is initializing
const fallbackProfile = {
  name: 'Vijay Bhesaniya',
  tagline_roles: [
    'Shopify Liquid Developer',
    'Python Developer',
    'WordPress Developer',
    'eCommerce Performance Specialist',
  ],
  summary:
    'Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.',
  email: 'bhesaniyav38@gmail.com',
  phone: '+91 95104 26764',
  linkedin: 'https://linkedin.com/in/bhesaniya-vijay-355b7020b',
  github: 'https://vijaybhesaniya.github.io/portfolio/',
  location: 'Ahmedabad, Gujarat, India',
  experience_years: 2,
  projects_count: 15,
  education:
    'Bachelor of Engineering — Computer Engineering, Om Engineering College, Junagadh, Gujarat | 2019 – 2023',
}

// Typewriter hook
function useTypewriter(texts: string[], speed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[index]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1))
        if (displayText.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setIndex((index + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, index, texts, speed, deleteSpeed, pauseTime])

  return displayText
}

interface Profile {
  name: string
  tagline_roles: string[]
  summary: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
  experience_years: number
  projects_count: number
  education?: string
  resume_pdf?: string
}

interface Skill {
  id: number
  category: string
  skill: string
}

interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  description: string | string[]
  is_current: boolean
}

interface Project {
  id: number
  name: string
  url: string
  description: string
  tech_stack: string | string[]
  category: string
  is_featured: boolean
}

interface Education {
  id: number
  degree: string
  institution: string
  location: string
  start_date: string
  end_date: string | null
}

const SECTIONS = [
  { id: '01', label: 'intro', href: '#hero' },
  { id: '02', label: 'about', href: '#about' },
  { id: '03', label: 'stack', href: '#skills' },
  { id: '04', label: 'log', href: '#experience' },
  { id: '05', label: 'work', href: '#projects' },
  { id: '06', label: 'edu', href: '#education' },
  { id: '07', label: 'contact', href: '#contact' },
]

interface HomeProps {
  darkMode?: boolean
}

export default function Home({ darkMode = true }: HomeProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const taglineRoles = profile?.tagline_roles || fallbackProfile.tagline_roles

  const roleText = useTypewriter(taglineRoles, 80, 40, 1600)

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill.skill)
    return acc
  }, {} as Record<string, string[]>)

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))]
  const visibleProjects = projects
    .filter((p) => !p.is_featured)
    .filter((p) => activeFilter === 'All' || p.category === activeFilter)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profData, skillsData, expData, projData, eduData] = await Promise.allSettled([
          getProfile(),
          getSkills(),
          getExperiences(),
          getProjects(),
          getEducation(),
        ])

        if (profData.status === 'fulfilled' && profData.value) {
          setProfile(profData.value as unknown as Profile)
        } else {
          setProfile(fallbackProfile as unknown as Profile)
        }

        if (skillsData.status === 'fulfilled') setSkills((skillsData.value || []) as unknown as Skill[])
        if (expData.status === 'fulfilled') setExperiences((expData.value || []) as unknown as Experience[])
        if (projData.status === 'fulfilled') setProjects((projData.value || []) as unknown as Project[])
        if (eduData.status === 'fulfilled') setEducation((eduData.value || []) as unknown as Education[])
      } catch (err) {
        console.error('Error loading Supabase portfolio data:', err)
        setProfile(fallbackProfile as unknown as Profile)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-void)' }}>
        <div className="text-center">
          <div className="mono text-sm mb-4" style={{ color: 'var(--teal-400)' }}>
            $ booting_portfolio<span className="cursor-blink">_</span>
          </div>
          <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--border-line)', borderTopColor: 'var(--teal-500)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-blob glow-teal w-[520px] h-[520px] -top-64 -left-64" />
        <div className="glow-blob glow-amber w-[420px] h-[420px] -bottom-32 -right-32" />
      </div>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 scanlines pointer-events-none z-0" />

      {/* 01 — Hero */}
      <section id="hero" className="min-h-screen flex items-center pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <span className="eyebrow">01 — intro</span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-5"
              style={{ color: 'var(--ink-100)' }}
            >
              {profile?.name || 'Vijay Bhesaniya'}
            </motion.h1>

            {/* Terminal prompt block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="panel max-w-xl mb-8 overflow-hidden"
            >
              <div className="terminal-chrome">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-path">~/whoami</span>
              </div>
              <div className="p-5">
                <div className="mono text-lg md:text-xl" style={{ color: 'var(--amber-400)' }}>
                  <span style={{ color: 'var(--ink-500)' }}>role:</span> {roleText}
                  <span className="cursor-blink ml-0.5">▌</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg max-w-2xl mb-10 leading-relaxed"
              style={{ color: 'var(--ink-300)' }}
            >
              {profile?.summary ||
                'Results-driven Shopify Liquid, Python, and WordPress developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => scrollToSection('#projects')} className="btn-primary px-6 py-3 flex items-center gap-2">
                View Projects <ArrowRight size={18} />
              </button>
              {profile?.resume_pdf ? (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(profile.resume_pdf)
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = 'resume.pdf'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      window.URL.revokeObjectURL(url)
                    } catch (error) {
                      console.error('Download error:', error)
                      window.open(profile.resume_pdf, '_blank')
                    }
                  }}
                  className="btn-ghost px-6 py-3 flex items-center gap-2"
                >
                  <Download size={18} /> Resume
                </button>
              ) : (
                <button
                  onClick={() => alert('Please add a resume link in the admin panel.')}
                  className="btn-ghost px-6 py-3 flex items-center gap-2"
                >
                  <Download size={18} /> Resume
                </button>
              )}
              <button onClick={() => scrollToSection('#contact')} className="btn-ghost px-6 py-3 flex items-center gap-2">
                <Terminal size={18} /> Hire Me
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-6">
              <a href={`mailto:${profile?.email || 'bhesaniyav38@gmail.com'}`} className="icon-link"><Mail size={20} /></a>
              <a href={`tel:${profile?.phone || '+919510426764'}`} className="icon-link"><Phone size={20} /></a>
              <a href={profile?.linkedin || 'https://linkedin.com/in/bhesaniya-vijay-355b7020b'} target="_blank" rel="noopener noreferrer" className="icon-link"><Linkedin size={20} /></a>
              <a href={profile?.github || 'https://vijaybhesaniya.github.io/portfolio/'} target="_blank" rel="noopener noreferrer" className="icon-link"><Github size={20} /></a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 02 — About */}
      <section id="about" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">02 — about</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ color: 'var(--ink-100)' }}>
              The <span className="gradient-text">short version.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-300)' }}>
                {profile?.summary ||
                  'Results-driven Shopify Liquid, Python, and WordPress developer with 2+ years of experience building custom, high-converting eCommerce storefronts, internal business systems, and content-managed websites. Skilled in Liquid templating, Python application development, custom theme development, Shopify app/API integrations, headless CMS (Contentful), React front ends, and performance optimization.'}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: `${profile?.experience_years || 2}+`, label: 'Years experience' },
                  { value: `${profile?.projects_count || 15}+`, label: 'Projects delivered' },
                  { value: profile?.location?.split(',')[0] || 'Ahmedabad', label: 'Based in' },
                  { value: 'B.E.', label: 'Computer engineering' },
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ y: -3 }} className="stat-card p-6">
                    <p className="text-3xl stat-number mb-2">{stat.value}</p>
                    <p className="text-sm" style={{ color: 'var(--ink-500)' }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 03 — Skills */}
      <section id="skills" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">03 — stack</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--ink-100)' }}>Tools of the trade.</h2>
            <p className="text-lg mb-12" style={{ color: 'var(--ink-500)' }}>Practical, production-tested skills across the stack.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(skillsByCategory).map(([category, skillList], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="panel panel-hover p-6"
                >
                  <h3 className="skill-group-title mb-4" style={{ color: index % 2 === 0 ? 'var(--teal-400)' : 'var(--amber-400)' }}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, i) => (
                      <span key={i} className={`skill-tag ${i % 2 === 0 ? 'accent-teal' : 'accent-amber'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 04 — Experience: git-log timeline */}
      <section id="experience" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">04 — git log --experience</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: 'var(--ink-100)' }}>Where I've built things.</h2>

            <div className="pl-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pb-10 pl-8"
                >
                  <div className="commit-line" />
                  <span className={`commit-dot absolute -left-[7px] top-1.5 ${exp.is_current ? 'current' : ''}`} />

                  <div className="commit-date mb-1">
                    {exp.start_date} {exp.end_date ? `→ ${exp.end_date}` : '→ HEAD'}
                  </div>

                  <div className="panel panel-hover p-6">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--ink-100)' }}>{exp.title}</h3>
                      {exp.is_current && <span className="filter-pill active px-3 py-1 rounded-full">current</span>}
                    </div>
                    <p style={{ color: 'var(--teal-400)' }} className="mb-1">{exp.company}</p>
                    <p className="commit-meta mb-4">{exp.location}</p>
                    <ul className="space-y-2">
                      {(Array.isArray(exp.description) ? exp.description : String(exp.description || '').split('\n').filter(Boolean)).map((desc, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--ink-300)' }}>
                          <span className="chip-dot mt-2 flex-shrink-0" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 05 — Projects */}
      <section id="projects" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">05 — work</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: 'var(--ink-100)' }}>Selected work.</h2>

            {projects.filter((p) => p.is_featured).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="featured-card p-8 mb-12"
              >
                <span className="featured-badge">★ featured</span>
                <h3 className="text-2xl font-bold mt-4 mb-1" style={{ color: 'var(--ink-100)' }}>{project.name}</h3>
                <p className="mono text-sm mb-4" style={{ color: 'var(--teal-400)' }}>{project.url.replace('https://', '')}</p>
                <p className="mb-6 max-w-2xl" style={{ color: 'var(--ink-300)' }}>{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(project.tech_stack) ? project.tech_stack : String(project.tech_stack || '').split(',').map(s => s.trim()).filter(Boolean)).map((tech, i) => (
                    <span key={i} className={`skill-tag ${i % 2 === 0 ? 'accent-teal' : 'accent-amber'}`}>{tech}</span>
                  ))}
                </div>

                <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium" style={{ color: 'var(--amber-400)' }}>
                  Visit site <ExternalLink size={16} />
                </a>
              </motion.div>
            ))}

            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`filter-pill px-4 py-2 rounded-full ${activeFilter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="panel panel-hover p-6 block group"
                >
                  <h3 className="text-lg font-semibold mb-2 transition-colors" style={{ color: 'var(--ink-100)' }}>
                    {project.name}
                  </h3>
                  <p className="mono text-xs mb-4 break-all" style={{ color: 'var(--ink-500)' }}>{project.url.replace('https://', '')}</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--teal-400)' }}>
                    <ExternalLink size={14} />
                    <span>View project</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 06 — Education */}
      <section id="education" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">06 — edu</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: 'var(--ink-100)' }}>Foundations.</h2>

            <div className="space-y-4 max-w-2xl">
              {education.map((edu) => (
                <motion.div key={edu.id} whileHover={{ y: -2 }} className="panel panel-hover p-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink-100)' }}>{edu.degree}</h3>
                  <p className="text-lg mb-2" style={{ color: 'var(--teal-400)' }}>{edu.institution}</p>
                  <p className="mono text-sm" style={{ color: 'var(--ink-500)' }}>
                    {edu.location} · {edu.start_date} – {edu.end_date || 'Present'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 07 — Contact */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">07 — contact</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--ink-100)' }}>
              Let's build <span className="gradient-text">something.</span>
            </h2>
            <p className="text-lg mb-12 max-w-2xl" style={{ color: 'var(--ink-300)' }}>
              Have a Shopify project, Python system, or WordPress build in mind? Drop a message — I usually reply within 24 hours.
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="panel p-6 h-fit">
                <div className="terminal-chrome -m-6 mb-6">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span className="terminal-path">~/contact</span>
                </div>
                <div className="space-y-4">
                  <a href={`tel:${profile?.phone || '+919510426764'}`} className="flex items-center gap-3 icon-link">
                    <Phone size={18} />
                    <span className="mono text-sm">{profile?.phone || '+91 95104 26764'}</span>
                  </a>
                  <a href={`mailto:${profile?.email || 'bhesaniyav38@gmail.com'}`} className="flex items-center gap-3 icon-link">
                    <Mail size={18} />
                    <span className="mono text-sm">{profile?.email || 'bhesaniyav38@gmail.com'}</span>
                  </a>
                  <a href={profile?.linkedin || 'https://linkedin.com/in/bhesaniya-vijay-355b7020b'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 icon-link">
                    <Linkedin size={18} />
                    <span className="mono text-sm">linkedin.com/in/bhesaniya-vijay</span>
                  </a>
                </div>
              </div>

              <ContactForm darkMode={darkMode} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 relative z-10" style={{ borderTop: '1px solid var(--border-line)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="chip-dot" />
            <span className="font-bold" style={{ color: 'var(--ink-100)' }}>Vijay.</span>
            <span className="mono text-xs ml-2" style={{ color: 'var(--ink-700)' }}>© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('#about')} className="text-sm transition-colors" style={{ color: 'var(--ink-500)' }}>About</button>
            <button onClick={() => scrollToSection('#projects')} className="text-sm transition-colors" style={{ color: 'var(--ink-500)' }}>Projects</button>
            <button onClick={() => scrollToSection('#contact')} className="text-sm transition-colors" style={{ color: 'var(--ink-500)' }}>Contact</button>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-panel)', color: 'var(--ink-500)', border: '1px solid var(--border-line)' }}
            >
              <ChevronUp size={18} />
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  )
}