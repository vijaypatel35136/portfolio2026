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
  X
} from 'lucide-react'
import { isAdminAuthenticated, logoutAdmin } from '../services/authService'
import { getProjects } from '../services/projectService'
import { getContactMessages } from '../services/contactService'
import { getExperiences } from '../services/experienceService'
import { getSkills } from '../services/skillService'
import ProfileManager from '../components/admin/ProfileManager'
import SkillsManager from '../components/admin/SkillsManager'
import ExperienceManager from '../components/admin/ExperienceManager'
import ProjectsManager from '../components/admin/ProjectsManager'
import EducationManager from '../components/admin/EducationManager'
import MessagesManager from '../components/admin/MessagesManager'
import ResumeManager from '../components/admin/ResumeManager'
import DatabaseManager from '../components/admin/DatabaseManager'
import { ToastContainer } from '../components/Toast'

interface DashboardStats {
  totalProjects: number
  totalMessages: number
  unreadMessages: number
  totalExperience: number
  totalSkills: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalExperience: 0,
    totalSkills: 0
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([])

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/vijay_dev')
      return
    }
    fetchDashboardData()
  }, [navigate, activeTab])

  const fetchDashboardData = async () => {
    try {
      const [projects, messages, experiences, skills] = await Promise.all([
        getProjects().catch(() => []),
        getContactMessages().catch(() => []),
        getExperiences().catch(() => []),
        getSkills().catch(() => [])
      ])
      setStats({
        totalProjects: projects.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.is_read).length,
        totalExperience: experiences.length,
        totalSkills: skills.length
      })
    } catch {
      // Fallback
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate('/vijay_dev')
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'database', label: 'Database', icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full" />
            <span className="font-heading text-xl font-bold">Vijay.</span>
          </div>
          <p className="mono text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-teal-500/20 text-teal-400' 
                        : 'text-gray-400 hover:text-white hover:bg-navy-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.id === 'messages' && stats.unreadMessages > 0 && (
                      <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {stats.unreadMessages}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-navy-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-navy-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-navy-800">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-500 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'dashboard' && (
                <Link
                  to="/"
                  target="_blank"
                  className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors flex items-center gap-2"
                >
                  <Eye size={18} />
                  View Site
                </Link>
              )}
            </div>
          </div>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                      <FolderOpen className="w-6 h-6 text-teal-600" />
                    </div>
                    <span className="text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                  </div>
                  <p className="text-3xl font-bold text-navy-800">{stats.totalProjects}</p>
                  <p className="text-gray-500">Total Projects</p>
                </div>

                <div
                  onClick={() => setActiveTab('messages')}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    {stats.unreadMessages > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {stats.unreadMessages} new
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-navy-800">{stats.totalMessages}</p>
                  <p className="text-gray-500">Total Messages</p>
                </div>

                <div
                  onClick={() => setActiveTab('experience')}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-green-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                  </div>
                  <p className="text-3xl font-bold text-navy-800">{stats.totalExperience}</p>
                  <p className="text-gray-500">Experience Entries</p>
                </div>

                <div
                  onClick={() => setActiveTab('skills')}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Code className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                  </div>
                  <p className="text-3xl font-bold text-navy-800">{stats.totalSkills}</p>
                  <p className="text-gray-500">Skills Listed</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-heading text-lg font-semibold text-navy-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'projects', label: 'Add Project', icon: FolderOpen },
                    { id: 'experience', label: 'Add Experience', icon: Briefcase },
                    { id: 'messages', label: 'View Messages', icon: MessageSquare },
                    { id: 'profile', label: 'Update Profile', icon: User }
                  ].map((action) => {
                    const Icon = action.icon
                    return (
                      <button 
                        key={action.id}
                        onClick={() => setActiveTab(action.id)}
                        className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Icon className="w-8 h-8 text-teal-600" />
                        <span className="text-navy-800 text-sm font-medium">{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Content Managers */}
          {activeTab === 'profile' && <ProfileManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'skills' && <SkillsManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'experience' && <ExperienceManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'projects' && <ProjectsManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'education' && <EducationManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'resume' && <ResumeManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'messages' && <MessagesManager onUpdate={fetchDashboardData} onToast={showToast} />}
          {activeTab === 'database' && <DatabaseManager onToast={showToast} />}
        </div>
      </main>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}