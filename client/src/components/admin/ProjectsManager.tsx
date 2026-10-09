import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, ExternalLink, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectService'
import ConfirmationModal from './ConfirmationModal'

interface Project {
  id: number
  name: string
  url: string
  description: string
  tech_stack: string   // comma-separated string for the form input
  category: string
  is_featured: boolean
}

interface ProjectsManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function ProjectsManager({ onUpdate, onToast, darkMode = true }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    tech_stack: '',
    category: 'Shopify',
    is_featured: false,
  })
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const data = await getProjects()
      setProjects(
        data.map((p) => ({
          id: p.id!,
          name: p.name,
          url: p.url || '',
          description: p.description || '',
          tech_stack: Array.isArray(p.tech_stack)
            ? p.tech_stack.join(', ')
            : String(p.tech_stack || ''),
          category: p.category || 'Shopify',
          is_featured: p.is_featured || false,
        })),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createProject({
        name: formData.name,
        url: formData.url,
        description: formData.description,
        tech_stack: formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        category: formData.category,
        is_featured: formData.is_featured,
        image_url: '',
        github_url: '',
      })
      setFormData({ name: '', url: '', description: '', tech_stack: '', category: 'Shopify', is_featured: false })
      setShowAddForm(false)
      await fetchProjects()
      onUpdate()
      onToast?.('Project added successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to add project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    setSaving(true)
    const project = projects.find((p) => p.id === id)
    if (!project) { setSaving(false); return }
    try {
      await updateProject(id, {
        name: project.name,
        url: project.url,
        description: project.description,
        tech_stack: project.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        category: project.category,
        is_featured: project.is_featured,
      })
      await fetchProjects()
      onUpdate()
      setEditingId(null)
      onToast?.('Project updated successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to update project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setSaving(true)
    try {
      await deleteProject(deleteId)
      await fetchProjects()
      onUpdate()
      setDeleteId(null)
      onToast?.('Project deleted successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to delete project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return
    try {
      await updateProject(id, {
        name: project.name,
        url: project.url,
        description: project.description,
        tech_stack: project.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        category: project.category,
        is_featured: !currentStatus,
      })
      await fetchProjects()
      onUpdate()
    } catch (err) {
      onToast?.('Failed to toggle featured status', 'error')
    }
  }

  if (loading) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`font-heading text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-navy-800'
        }`}>Projects Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-6 ${
            darkMode
              ? 'bg-navy-800 border-navy-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`font-heading text-lg font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-navy-800'
          }`}>Add New Project</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Project URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-navy-800'
              }`}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-navy-700 border-navy-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-black'
                }`}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="Shopify Liquid, CSS, JavaScript"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                >
                  <option>Shopify</option>
                  <option>Python</option>
                  <option>WordPress</option>
                  <option>React</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured_add"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="is_featured_add" className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Featured Project</label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  darkMode
                    ? 'border-navy-600 text-gray-300 hover:bg-navy-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  darkMode
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                {saving ? 'Saving...' : 'Add Project'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className={`rounded-xl border p-12 text-center ${
          darkMode
            ? 'bg-navy-800 border-navy-700'
            : 'bg-white border-gray-200'
        }`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-400'}>No projects yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className={`rounded-xl border p-6 relative ${
              darkMode
                ? 'bg-navy-800 border-navy-700'
                : 'bg-white border-gray-200'
            }`}>
              {project.is_featured && (
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}

              {editingId === project.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, name: e.target.value } : p))}
                    placeholder="Project name"
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-black'
                    }`}
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, url: e.target.value } : p))}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-black'
                    }`}
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, description: e.target.value } : p))}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-black'
                    }`}
                  />
                  <input
                    type="text"
                    value={project.tech_stack}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, tech_stack: e.target.value } : p))}
                    placeholder="React, TypeScript, ..."
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-black'
                    }`}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(project.id)}
                      disabled={saving}
                      className={`p-2 rounded transition-colors disabled:opacity-50 ${
                        darkMode
                          ? 'text-green-400 hover:bg-green-900/30'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={`p-2 rounded transition-colors ${
                        darkMode
                          ? 'text-gray-400 hover:bg-navy-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className={`font-heading text-lg font-bold mb-2 pr-8 ${
                    darkMode ? 'text-white' : 'text-navy-800'
                  }`}>{project.name}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline text-sm flex items-center gap-1 mb-3 ${
                      darkMode ? 'text-teal-400' : 'text-teal-600'
                    }`}
                  >
                    {project.url.replace('https://', '')}
                    <ExternalLink size={14} />
                  </a>
                  {project.description && (
                    <p className={`text-sm mb-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{project.description}</p>
                  )}
                  {project.tech_stack && (
                    <p className={`text-xs mb-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span className="font-semibold">Tech:</span> {project.tech_stack}
                    </p>
                  )}
                  <div className={`flex items-center justify-between pt-3 border-t ${
                    darkMode ? 'border-navy-700' : 'border-gray-200'
                  }`}>
                    <span className={`text-xs px-2 py-1 rounded ${
                      darkMode
                        ? 'bg-navy-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}>{project.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(project.id, project.is_featured)}
                        className={`p-2 rounded transition-colors ${
                          darkMode
                            ? 'text-yellow-500 hover:bg-yellow-900/30'
                            : 'text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={project.is_featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star size={16} className={project.is_featured ? 'fill-yellow-500' : ''} />
                      </button>
                      <button
                        onClick={() => setEditingId(project.id)}
                        className={`p-2 rounded transition-colors ${
                          darkMode
                            ? 'text-blue-400 hover:bg-blue-900/30'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className={`p-2 rounded transition-colors ${
                          darkMode
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
