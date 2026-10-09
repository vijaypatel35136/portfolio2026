import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Code,
  Briefcase,
  FolderOpen,
  GraduationCap,
  MessageSquare,
  LogOut,
  Eye,
  FileText,
  Database,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { isAdminAuthenticated, logoutAdmin } from '../services/authService'
import { getProjects }       from '../services/projectService'
import { getContactMessages } from '../services/contactService'
import { getExperiences }    from '../services/experienceService'
import { getSkills }         from '../services/skillService'
import ProfileManager    from '../components/admin/ProfileManager'
import SkillsManager     from '../components/admin/SkillsManager'
import ExperienceManager from '../components/admin/ExperienceManager'
import ProjectsManager   from '../components/admin/ProjectsManager'
import EducationManager  from '../components/admin/EducationManager'
import MessagesManager   from '../components/admin/MessagesManager'
import ResumeManager     from '../components/admin/ResumeManager'
import DatabaseManager   from '../components/admin/DatabaseManager'
import { ToastContainer }    from '../components/Toast'

interface DashboardStats {
  totalProjects:   number
  totalMessages:   number
  unreadMessages:  number
  totalExperience: number
  totalSkills:     number
}

const sidebarItems = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'profile',    label: 'Profile',    icon: User            },
  { id: 'skills',     label: 'Skills',     icon: Code            },
  { id: 'experience', label: 'Experience', icon: Briefcase       },
  { id: 'projects',   label: 'Projects',   icon: FolderOpen      },
  { id: 'education',  label: 'Education',  icon: GraduationCap   },
  { id: 'resume',     label: 'Resume',     icon: FileText        },
  { id: 'messages',   label: 'Messages',   icon: MessageSquare   },
  { id: 'database',   label: 'Database',   icon: Database        },
]

const quickActions = [
  { id: 'projects',   label: 'Add Project',     hint: 'Showcase new work',     icon: FolderOpen    },
  { id: 'experience', label: 'Add Experience',  hint: 'Extend your timeline',  icon: Briefcase     },
  { id: 'messages',   label: 'View Messages',   hint: 'Read new enquiries',    icon: MessageSquare },
  { id: 'profile',    label: 'Update Profile',  hint: 'Bio, links & contact',  icon: User          },
  { id: 'resume',     label: 'Upload Resume',   hint: 'Keep your CV current',  icon: FileText      },
  { id: 'skills',     label: 'Edit Skills',     hint: 'Tune your stack',       icon: Code          },
]

const statCards = (stats: DashboardStats, nav: (id: string) => void) => [
  {
    label:   'Total Projects',
    value:   stats.totalProjects,
    icon:    FolderOpen,
    iconBg:  'rgba(13,148,136,0.14)',
    iconClr: 'var(--teal-500)',
    badge:   null as null | string,
    onClick: () => nav('projects'),
  },
  {
    label:   'Total Messages',
    value:   stats.totalMessages,
    icon:    MessageSquare,
    iconBg:  'rgba(96,165,250,0.12)',
    iconClr: 'var(--color-info)',
    badge:   stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : null,
    onClick: () => nav('messages'),
  },
  {
    label:   'Experience Entries',
    value:   stats.totalExperience,
    icon:    Briefcase,
    iconBg:  'rgba(16,185,129,0.12)',
    iconClr: 'var(--color-success)',
    badge:   null,
    onClick: () => nav('experience'),
  },
  {
    label:   'Skills Listed',
    value:   stats.totalSkills,
    icon:    Code,
    iconBg:  'rgba(139,92,246,0.12)',
    iconClr: '#8b5cf6',
    badge:   null,
    onClick: () => nav('skills'),
  },
]

interface AdminDashboardProps {
  darkMode?: boolean
  setDarkMode?: (value: boolean) => void
}

export default function AdminDashboard({ darkMode = true, setDarkMode }: AdminDashboardProps) {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0, totalMessages: 0, unreadMessages: 0, totalExperience: 0, totalSkills: 0,
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([])

  const showToast  = (message: string, type: 'success' | 'error') =>
    setToasts(prev => [...prev, { id: Date.now().toString(), message, type }])
  const removeToast = (id: string) =>
    setToasts(prev => prev.filter(t => t.id !== id))

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate('/vijay_dev'); return }
    fetchDashboardData()
  }, [navigate, activeTab])

  const fetchDashboardData = async () => {
    try {
      const [projects, messages, experiences, skills] = await Promise.all([
        getProjects().catch(() => []),
        getContactMessages().catch(() => []),
        getExperiences().catch(() => []),
        getSkills().catch(() => []),
      ])
      setStats({
        totalProjects:   projects.length,
        totalMessages:   messages.length,
        unreadMessages:  messages.filter((m: { is_read: boolean }) => !m.is_read).length,
        totalExperience: experiences.length,
        totalSkills:     skills.length,
      })
    } catch { /* ignore */ }
  }

  const handleLogout = () => { logoutAdmin(); navigate('/vijay_dev') }
  const currentLabel = sidebarItems.find(i => i.id === activeTab)?.label ?? 'Dashboard'
  const goTo = (id: string) => { setActiveTab(id); setSidebarOpen(false) }
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen flex" style={{ color: 'var(--ink-100)' }}>
      {/* mobile scrim */}
      <div
        className={`admin-scrim ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* ═══════════════════════ SIDEBAR ═══════════════════════ */}
      <aside
        className={`admin-sidebar w-64 flex flex-col fixed h-full z-40 ${sidebarOpen ? 'open' : ''}`}
        aria-label="Admin navigation"
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-line)' }}>
          <Link to="/" className="flex items-center gap-2.5" aria-label="Open portfolio">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--teal-500)', boxShadow: '0 0 10px var(--teal-400)' }}
            />
            <div>
              <span className="font-heading text-lg font-bold" style={{ color: 'var(--ink-100)' }}>
                Vijay<span style={{ color: 'var(--amber-400)' }}>.</span>
              </span>
              <p className="mono text-[11px] leading-none mt-0.5" style={{ color: 'var(--ink-700)' }}>
                admin panel
              </p>
            </div>
          </Link>
          <button
            className="only-mobile p-2 rounded-lg"
            style={{ color: 'var(--ink-500)' }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto" aria-label="Sidebar navigation">
          <p className="mono text-[11px] uppercase tracking-widest px-3 pt-2 pb-3" style={{ color: 'var(--ink-700)' }}>
            Manage
          </p>
          <ul className="space-y-1">
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => goTo(id)}
                  className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {id === 'messages' && stats.unreadMessages > 0 && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'var(--amber-400)', color: '#1a1203' }}
                    >
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--border-line)' }}>
          <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            <Eye size={18} />
            <span>View site</span>
            <ArrowUpRight size={14} className="ml-auto" style={{ opacity: 0.5 }} />
          </Link>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-400)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════ MAIN ═══════════════════════ */}
      <div className="admin-main flex-1 min-h-screen flex flex-col">
        <header className="admin-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="only-mobile p-2.5 rounded-xl"
              style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-line)', color: 'var(--ink-300)' }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--ink-700)' }}>
                admin / {currentLabel.toLowerCase()}
              </p>
              <h1 className="font-heading text-xl md:text-2xl font-bold truncate" style={{ color: 'var(--ink-100)' }}>
                {currentLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {setDarkMode && <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost hidden sm:flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Eye size={16} />
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* ── Dashboard Overview ── */}
            {activeTab === 'dashboard' && (
              <>
                <div className="hello-banner p-7 md:p-10 mb-8">
                  <div className="flex items-start justify-between gap-6 flex-wrap relative">
                    <div>
                      <span className="eyebrow">overview</span>
                      <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ color: 'var(--ink-100)' }}>
                        {greeting}, <span className="gradient-text">Vijay.</span>
                      </h2>
                      <p className="max-w-xl" style={{ color: 'var(--ink-300)' }}>
                        {stats.unreadMessages > 0
                          ? `You have ${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? 's' : ''} waiting. `
                          : 'Your inbox is all caught up. '}
                        Everything you change here updates the live portfolio.
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {stats.unreadMessages > 0 && (
                        <button
                          onClick={() => goTo('messages')}
                          className="btn-primary cta-glow px-6 py-3 flex items-center gap-2"
                        >
                          <MessageSquare size={17} /> Open inbox
                        </button>
                      )}
                      <button onClick={() => goTo('projects')} className="btn-ghost px-6 py-3 flex items-center gap-2">
                        <Sparkles size={17} /> Add project
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  {statCards(stats, goTo).map(({ label, value, icon: Icon, iconBg, iconClr, badge, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="kpi p-6 group"
                      style={{ ['--kpi' as string]: iconBg }}
                    >
                      <div className="flex items-start justify-between mb-5 relative z-10">
                        <div className="admin-stat-icon" style={{ background: iconBg }}>
                          <Icon size={21} style={{ color: iconClr }} />
                        </div>
                        {badge && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{ background: 'var(--amber-100)', color: 'var(--amber-400)', border: '1px solid rgba(245,158,11,0.35)' }}
                          >
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className="text-4xl font-bold font-heading mb-1 relative z-10" style={{ color: 'var(--ink-100)' }}>
                        {value}
                      </p>
                      <p className="text-sm font-medium relative z-10" style={{ color: 'var(--ink-500)' }}>
                        {label}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="admin-card p-6 md:p-7" style={{ borderRadius: 'var(--radius-xl)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--ink-100)' }}>
                      Quick actions
                    </h2>
                    <span className="mono text-xs" style={{ color: 'var(--ink-700)' }}>shortcuts</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickActions.map(({ id, label, hint, icon: Icon }) => (
                      <button key={id} onClick={() => goTo(id)} className="quick-tile">
                        <span className="ic"><Icon size={18} /></span>
                        <span>
                          <span className="block text-sm font-semibold" style={{ color: 'inherit' }}>{label}</span>
                          <span className="block text-xs mt-0.5" style={{ color: 'var(--ink-500)' }}>{hint}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Content Managers */}
            {activeTab === 'profile'    && <ProfileManager    onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'skills'     && <SkillsManager     onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'experience' && <ExperienceManager onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'projects'   && <ProjectsManager   onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'education'  && <EducationManager  onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'resume'     && <ResumeManager     onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'messages'   && <MessagesManager   onUpdate={fetchDashboardData} onToast={showToast} />}
            {activeTab === 'database'   && <DatabaseManager   onToast={showToast} />}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
