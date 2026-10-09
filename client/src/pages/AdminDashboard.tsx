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
} from 'lucide-react'
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
  { id: 'projects',   label: 'Add Project',     icon: FolderOpen    },
  { id: 'experience', label: 'Add Experience',  icon: Briefcase     },
  { id: 'messages',   label: 'View Messages',   icon: MessageSquare },
  { id: 'profile',    label: 'Update Profile',  icon: User          },
]

const statCards = (stats: DashboardStats, nav: (id: string) => void) => [
  {
    label:   'Total Projects',
    value:   stats.totalProjects,
    icon:    FolderOpen,
    iconBg:  'rgba(13,148,136,0.12)',
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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0, totalMessages: 0, unreadMessages: 0, totalExperience: 0, totalSkills: 0,
  })
  const [activeTab, setActiveTab] = useState('dashboard')
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

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-void)', color: 'var(--ink-100)' }}
    >
      {/* ═══════════════════════ SIDEBAR ═══════════════════════ */}
      <aside
        className="admin-sidebar w-64 flex flex-col fixed h-full z-40"
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <div className="p-6 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border-line)' }}>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--teal-500)', boxShadow: '0 0 8px var(--teal-500)' }}
          />
          <div>
            <span className="font-heading text-lg font-bold" style={{ color: 'var(--ink-100)' }}>
              Vijay.
            </span>
            <p className="mono text-xs mt-0.5" style={{ color: 'var(--ink-700)' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 overflow-y-auto" aria-label="Sidebar navigation">
          <ul className="space-y-0.5">
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {id === 'messages' && stats.unreadMessages > 0 && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'var(--teal-500)',
                        color: 'var(--ink-on-primary)',
                      }}
                    >
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border-line)' }}>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ color: 'var(--ink-500)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-400)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-500)')}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════ MAIN ═══════════════════════ */}
      <main className="flex-1 ml-64 p-8 overflow-auto min-h-screen">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1
                className="font-heading text-2xl font-bold"
                style={{ color: 'var(--ink-100)' }}
              >
                {currentLabel}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ink-500)' }}>
                Manage your portfolio content
              </p>
            </div>
            {activeTab === 'dashboard' && (
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Eye size={16} />
                View Site
              </Link>
            )}
          </div>

          {/* ── Dashboard Overview ── */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards(stats, setActiveTab).map(({ label, value, icon: Icon, iconBg, iconClr, badge, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="admin-card p-6 text-left group cursor-pointer"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="admin-stat-icon"
                        style={{ background: iconBg }}
                      >
                        <Icon size={20} style={{ color: iconClr }} />
                      </div>
                      {badge && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-3xl font-bold font-heading mb-1"
                      style={{ color: 'var(--ink-100)' }}
                    >
                      {value}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink-500)' }}>
                      {label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="admin-card p-6" style={{ borderRadius: 'var(--radius-lg)' }}>
                <h2
                  className="font-heading text-base font-semibold mb-5"
                  style={{ color: 'var(--ink-100)' }}
                >
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all text-center"
                      style={{
                        background: 'var(--bg-panel-2)',
                        border: '1px solid var(--border-line)',
                        color: 'var(--ink-300)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.borderColor = 'var(--teal-500)'
                        el.style.background  = 'var(--teal-100)'
                        el.style.color       = 'var(--teal-500)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.borderColor = 'var(--border-line)'
                        el.style.background  = 'var(--bg-panel-2)'
                        el.style.color       = 'var(--ink-300)'
                      }}
                    >
                      <Icon size={22} />
                      <span className="text-sm font-medium">{label}</span>
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}