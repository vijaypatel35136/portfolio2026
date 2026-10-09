import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Download, Mail, Phone, Linkedin, Github, ChevronUp, Terminal, Sparkles, Zap,
  MapPin, Rocket, GraduationCap, Briefcase, ShoppingBag, Code2, Globe, Layers, Server, Wrench,
} from 'lucide-react'
import ContactForm from '../components/ContactForm'
import ScrollReveal from '../components/ScrollReveal'
import { getProfile } from '../services/profileService'
import { getSkills } from '../services/skillService'
import { getExperiences } from '../services/experienceService'
import { getProjects } from '../services/projectService'
import { getEducation } from '../services/educationService'

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
  experience_months: number
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

interface HomeProps {
  darkMode?: boolean
  setDarkMode?: (value: boolean) => void
}

export default function Home({ darkMode = true, setDarkMode }: HomeProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const taglineRoles = profile?.tagline_roles || ['Shopify Developer', 'Python Django Developer', 'WordPress Developer']

  const roleText = useTypewriter(taglineRoles, 80, 40, 1600)

  // Format experience duration
  const formatExperience = () => {
    const years = profile?.experience_years || 0
    const months = profile?.experience_months || 0

    if (years === 0 && months === 0) return 'entry-level'
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`
  }

  // Format summary with dynamic experience
  const formatSummary = (summary: string) => {
    const experience = formatExperience()
    return summary.replace(/\{experience\}/g, experience)
  }

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
        }

        if (skillsData.status === 'fulfilled') setSkills((skillsData.value || []) as unknown as Skill[])
        if (expData.status === 'fulfilled') setExperiences((expData.value || []) as unknown as Experience[])
        if (projData.status === 'fulfilled') setProjects((projData.value || []) as unknown as Project[])
        if (eduData.status === 'fulfilled') setEducation((eduData.value || []) as unknown as Education[])
      } catch (err) {
        console.error('Error loading Supabase portfolio data:', err)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mono text-sm mb-5" style={{ color: 'var(--teal-400)' }}>
            $ booting_portfolio<span className="cursor-blink">_</span>
          </div>
          <div className="loader-ring mx-auto" />
        </div>
      </div>
    )
  }

  const nameParts = (profile?.name || 'Vijay Bhesaniya').trim().split(/\s+/)
  const firstName = nameParts[0]
  const restName = nameParts.slice(1).join(' ')
  const email = profile?.email || 'bhesaniyav38@gmail.com'
  const phone = profile?.phone || '+91 95104 26764'
  const linkedin = profile?.linkedin || 'https://linkedin.com/in/bhesaniya-vijay-355b7020b'
  const github = profile?.github || 'https://vijaybhesaniya.github.io/portfolio/'
  const city = profile?.location?.split(',')[0] || 'Ahmedabad'
  const summaryText = profile?.summary
    ? formatSummary(profile.summary)
    : `Results-driven Shopify Liquid, Python, and WordPress developer with ${formatExperience()} of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.`

  const marqueeItems = (skills.length ? Array.from(new Set(skills.map((s) => s.skill))) : taglineRoles).slice(0, 18)

  const featured = projects.filter((p) => p.is_featured)
  const techList = (t: string | string[]) =>
    (Array.isArray(t) ? t : String(t || '').split(',').map((x) => x.trim()).filter(Boolean))

  const downloadResume = async () => {
    if (!profile?.resume_pdf) {
      alert('Please add a resume link in the admin panel.')
      return
    }
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
  }

  return (
    <div className="relative">
      {/* ═════════════ 01 — HERO ═════════════ */}
      <section id="hero" className="min-h-screen flex items-center !pt-32 !pb-20 relative">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <div className="status-pill mb-8">
              <span className="pulse-dot" />
              <span>{city} · open to new projects</span>
            </div>

            <h1 className="hero-title mb-7">
              <span style={{ color: 'var(--ink-100)' }}>{firstName}</span>
              {restName && (
                <>
                  <br />
                  <span className="gradient-text">{restName}</span>
                </>
              )}
            </h1>

            <div className="role-chip mb-8">
              <span style={{ color: 'var(--ink-500)' }}>role →</span>
              <span>
                {roleText}
                <span className="cursor-blink ml-0.5">▌</span>
              </span>
            </div>

            <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{ color: 'var(--ink-300)' }}>
              {summaryText}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection('#projects')}
                className="btn-primary cta-glow px-7 py-4 flex items-center gap-2 text-base"
              >
                View Projects <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={downloadResume}
                className="btn-ghost px-7 py-4 flex items-center gap-2 text-base"
              >
                <Download size={18} /> Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection('#contact')}
                className="btn-ghost px-7 py-4 flex items-center gap-2 text-base"
              >
                <Terminal size={18} /> Hire Me
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              <a href={`mailto:${email}`} className="social-btn" aria-label="Email"><Mail size={19} /></a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="social-btn" aria-label="Phone"><Phone size={19} /></a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn"><Linkedin size={19} /></a>
              <a href={github} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub"><Github size={19} /></a>
              <span className="mono text-xs ml-3 hidden sm:inline-flex items-center gap-2" style={{ color: 'var(--ink-700)' }}>
                <MapPin size={13} /> {profile?.location || 'Ahmedabad, India'}
              </span>
            </div>
          </motion.div>

          {/* Code card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="panel code-card" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <div className="terminal-chrome">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-path">~/vijay.dev.ts</span>
              </div>
              <pre>
                <span className="tok-k">const</span> developer = {'{'}
                {'\n  '}name: <span className="tok-s">"{profile?.name || 'Vijay Bhesaniya'}"</span>,
                {'\n  '}roles: [
                {taglineRoles.slice(0, 3).map((r, i, arr) => (
                  <span key={r}>
                    {'\n    '}<span className="tok-s">"{r}"</span>{i < arr.length - 1 ? ',' : ''}
                  </span>
                ))}
                {'\n  '}],
                {'\n  '}experience: <span className="tok-s">"{formatExperience()}"</span>,
                {'\n  '}projects: <span className="tok-n">{profile?.projects_count || 15}</span>,
                {'\n  '}based: <span className="tok-s">"{city}"</span>,
                {'\n  '}ships: <span className="tok-n">true</span>,
                {'\n'}{'}'}
                {'\n\n'}<span className="tok-c">// let's build something good</span>
              </pre>
            </div>

            <span className="float-badge" style={{ top: -22, right: -14 }}>
              <span className="chip-dot" /> Shopify Liquid
            </span>
            <span className="float-badge" style={{ bottom: 38, left: -34, animationDelay: '1.2s' }}>
              <span className="chip-dot" style={{ background: 'var(--amber-400)' }} /> Python · Django
            </span>
            <span className="float-badge" style={{ bottom: -24, right: 30, animationDelay: '2.4s' }}>
              <span className="chip-dot" /> WordPress
            </span>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      {marqueeItems.length > 0 && (
        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex">
                {marqueeItems.map((item) => (
                  <span key={`${dup}-${item}`} className="marquee-item">
                    {item}
                    <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════ 02 — ABOUT ═════════════ */}
      <section id="about">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <SectionHead
              num="02"
              eyebrow="about"
              title={<>The <span className="gradient-text">short version.</span></>}
            />
          </ScrollReveal>

          <ScrollReveal stagger animation="up" delay={100}>
            <div className="grid md:grid-cols-4 gap-5">
              <div className="panel p-8 md:p-10 md:col-span-2 md:row-span-2 flex flex-col justify-between">
                <div>
                  <span className="skill-icon mb-6"><Sparkles size={20} /></span>
                  <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--ink-200)' }}>
                    {profile?.summary
                      ? formatSummary(profile.summary)
                      : `Results-driven Shopify Liquid, Python, and WordPress developer with ${formatExperience()} of experience building custom, high-converting eCommerce storefronts, internal business systems, and content-managed websites. Skilled in Liquid templating, Python application development, custom theme development, Shopify app/API integrations, headless CMS (Contentful), React front ends, and performance optimization.`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  {taglineRoles.slice(0, 4).map((r, i) => (
                    <span key={r} className={`skill-tag ${i % 2 === 0 ? 'accent-teal' : 'accent-amber'}`}>{r}</span>
                  ))}
                </div>
              </div>

              {[
                { value: `${profile?.experience_years || 2}+`, label: 'Years experience', icon: <Zap size={18} /> },
                { value: `${profile?.projects_count || 15}+`, label: 'Projects delivered', icon: <Rocket size={18} /> },
                { value: city, label: 'Based in', icon: <MapPin size={18} /> },
                { value: 'B.E.', label: 'Computer engineering', icon: <GraduationCap size={18} /> },
              ].map((stat, i) => (
                <div key={i} className="stat-card p-6 flex flex-col justify-between min-h-[150px]">
                  <span style={{ color: i % 2 === 0 ? 'var(--teal-400)' : 'var(--amber-400)' }}>{stat.icon}</span>
                  <div>
                    <p className="text-3xl md:text-4xl stat-number mb-1">{stat.value}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink-500)' }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ 03 — SKILLS ═════════════ */}
      <section id="skills">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <SectionHead
              num="03"
              eyebrow="stack"
              title="Tools of the trade."
              sub="Practical, production-tested skills across the stack."
            />
          </ScrollReveal>

          <ScrollReveal stagger animation="up" delay={100}>
            <div className="grid md:grid-cols-2 gap-5">
              {Object.entries(skillsByCategory).map(([category, skillList], index) => {
                const Icon = SKILL_ICONS[index % SKILL_ICONS.length]
                const amber = index % 2 === 1
                return (
                  <div key={category} className="panel panel-hover p-7">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`skill-icon ${amber ? 'amber' : ''}`}><Icon size={20} /></span>
                      <span className="mono text-xs" style={{ color: 'var(--ink-700)' }}>
                        {String(skillList.length).padStart(2, '0')} skills
                      </span>
                    </div>
                    <h3 className="skill-group-title mb-4" style={{ color: amber ? 'var(--amber-400)' : 'var(--teal-400)' }}>
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill, i) => (
                        <span key={i} className={`skill-tag ${i % 2 === 0 ? 'accent-teal' : 'accent-amber'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ 04 — EXPERIENCE ═════════════ */}
      <section id="experience">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <SectionHead num="04" eyebrow="git log --experience" title="Where I've built things." />
          </ScrollReveal>

          <ScrollReveal stagger animation="up" delay={100}>
            <div className="tl max-w-4xl">
              {experiences.map((exp) => (
                <div key={exp.id} className="tl-item">
                  <span className={`tl-node ${exp.is_current ? 'current' : ''}`} />
                  <div className="panel panel-hover p-7">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <div className="commit-date mb-2">
                          {exp.start_date} {exp.end_date ? `→ ${exp.end_date}` : '→ HEAD'}
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--ink-100)' }}>{exp.title}</h3>
                        <p className="mt-1 flex items-center gap-2 flex-wrap" style={{ color: 'var(--teal-400)' }}>
                          <Briefcase size={15} /> {exp.company}
                          {exp.location && <span className="commit-meta">· {exp.location}</span>}
                        </p>
                      </div>
                      {exp.is_current && <span className="filter-pill active px-3 py-1">● current</span>}
                    </div>
                    <ul className="space-y-2.5">
                      {(Array.isArray(exp.description) ? exp.description : String(exp.description || '').split('\n').filter(Boolean)).map((desc, i) => (
                        <li key={i} className="text-sm leading-relaxed flex items-start gap-3" style={{ color: 'var(--ink-300)' }}>
                          <span className="chip-dot mt-2" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ 05 — PROJECTS ═════════════ */}
      <section id="projects">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <SectionHead num="05" eyebrow="work" title="Selected work." sub="Live builds — storefronts, systems and sites shipped to production." />
          </ScrollReveal>

          {featured.map((project) => (
            <ScrollReveal key={project.id} animation="scale" delay={100}>
              <div className="featured-card p-6 md:p-10 mb-8 grid lg:grid-cols-2 gap-10 items-center">
                <div className="relative">
                  <span className="featured-badge">★ featured</span>
                  <h3 className="text-3xl md:text-4xl font-bold mt-5 mb-2" style={{ color: 'var(--ink-100)' }}>{project.name}</h3>
                  <p className="mono text-sm mb-5" style={{ color: 'var(--teal-400)' }}>{(project.url || '').replace('https://', '')}</p>
                  <p className="mb-6 leading-relaxed" style={{ color: 'var(--ink-300)' }}>{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {techList(project.tech_stack).map((tech, i) => (
                      <span key={i} className={`skill-tag ${i % 2 === 0 ? 'accent-teal' : 'accent-amber'}`}>{tech}</span>
                    ))}
                  </div>

                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary cta-glow inline-flex items-center gap-2 px-6 py-3">
                    Visit site <ArrowUpRight size={17} />
                  </a>
                </div>

                <a href={project.url} target="_blank" rel="noopener noreferrer" className="browser-mock block relative group" aria-label={`Open ${project.name}`}>
                  <div className="browser-bar">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                    <span className="browser-url">{(project.url || '').replace('https://', '')}</span>
                  </div>
                  <div className="browser-body">
                    <span>{project.name.slice(0, 14)}</span>
                  </div>
                </a>
              </div>
            </ScrollReveal>
          ))}

          <div className="flex flex-wrap gap-2.5 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`filter-pill px-4 py-2 ${activeFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <ScrollReveal stagger animation="up" delay={150}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProjects.map((project, index) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel panel-hover proj-card group"
                >
                  <div className={`proj-thumb t${index % 3}`}>
                    <span className="proj-initial">{project.name.charAt(0).toUpperCase()}</span>
                    <span className="proj-arrow"><ArrowUpRight size={17} /></span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-1.5" style={{ color: 'var(--ink-100)' }}>{project.name}</h3>
                    <p className="mono text-xs break-all mb-4" style={{ color: 'var(--ink-500)' }}>{(project.url || '').replace('https://', '')}</p>
                    {project.category && <span className="skill-tag accent-teal">{project.category}</span>}
                  </div>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ 06 — EDUCATION ═════════════ */}
      <section id="education">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <SectionHead num="06" eyebrow="edu" title="Foundations." />
          </ScrollReveal>

          <ScrollReveal stagger animation="up" delay={100}>
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
              {education.map((edu) => (
                <div key={edu.id} className="panel panel-hover p-8">
                  <span className="skill-icon amber mb-6"><GraduationCap size={20} /></span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--ink-100)' }}>{edu.degree}</h3>
                  <p className="text-base mb-3" style={{ color: 'var(--teal-400)' }}>{edu.institution}</p>
                  <p className="mono text-xs" style={{ color: 'var(--ink-500)' }}>
                    {edu.location} · {edu.start_date} – {edu.end_date || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ 07 — CONTACT ═════════════ */}
      <section id="contact">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal animation="up">
            <div className="cta-banner p-4 md:p-14">
              <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 items-start relative">
                <div style={{ wordWrap: 'anywhere' }}>
                  <span className="eyebrow">07 — contact</span>
                  <h2 className="text-4xl md:text-6xl font-bold mb-5" style={{ color: 'var(--ink-100)' }}>
                    Let's build <span className="gradient-text">something.</span>
                  </h2>
                  <p className="text-lg mb-9 max-w-md" style={{ color: 'var(--ink-300)' }}>
                    Have a Shopify project, Python system, or WordPress build in mind? Drop a message — I usually reply within 24 hours.
                  </p>

                  <div className="space-y-3">
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-row">
                      <span className="ic"><Phone size={18} /></span>
                      <span className="mono text-sm" style={{ color: 'var(--ink-200)' }}>{phone}</span>
                    </a>
                    <a href={`mailto:${email}`} className="contact-row">
                      <span className="ic"><Mail size={18} /></span>
                      <span className="mono text-sm break-all" style={{ color: 'var(--ink-200)' }}>{email}</span>
                    </a>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact-row">
                      <span className="ic"><Linkedin size={18} /></span>
                      <span className="mono text-sm" style={{ color: 'var(--ink-200)' }}>linkedin.com/in/bhesaniya-vijay</span>
                    </a>
                  </div>
                </div>

                <ContactForm darkMode={darkMode} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═════════════ FOOTER ═════════════ */}
      <footer className="relative pt-10 pb-8 px-6 overflow-hidden" style={{ borderTop: '1px solid var(--border-line)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mega-word mb-8" aria-hidden>Vijay.</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="chip-dot" />
              <span className="font-bold" style={{ color: 'var(--ink-100)' }}>Vijay.</span>
              <span className="mono text-xs ml-2" style={{ color: 'var(--ink-700)' }}>© 2026</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('#about')} className="text-sm hover:opacity-80" style={{ color: 'var(--ink-500)' }}>About</button>
              <button onClick={() => scrollToSection('#projects')} className="text-sm hover:opacity-80" style={{ color: 'var(--ink-500)' }}>Projects</button>
              <button onClick={() => scrollToSection('#contact')} className="text-sm hover:opacity-80" style={{ color: 'var(--ink-500)' }}>Contact</button>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="back-to-top w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Back to top"
              >
                <ChevronUp size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ───────────────────────── helpers ───────────────────────── */

const SKILL_ICONS = [ShoppingBag, Code2, Globe, Layers, Server, Wrench]

function SectionHead({
  num,
  eyebrow,
  title,
  sub,
}: {
  num: string
  eyebrow: string
  title: React.ReactNode
  sub?: string
}) {
  return (
    <div className="sec-head">
      <span className="sec-num" aria-hidden>{num}</span>
      <span className="eyebrow">{num} — {eyebrow}</span>
      <h2 className="sec-title">{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  )
}
