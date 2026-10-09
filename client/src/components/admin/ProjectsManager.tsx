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
}

export default function ProjectsManager({ onUpdate, onToast }: ProjectsManagerProps) {
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
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading projects...</p>
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
        <h2 className="font-heading text-2xl font-bold text-navy-800">Projects Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="font-heading text-lg font-semibold text-navy-800 mb-4">Add New Project</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Project URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="Shopify Liquid, CSS, JavaScript"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
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
              <label htmlFor="is_featured_add" className="text-sm text-gray-700">Featured Project</label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add Project'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400">No projects yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6 relative">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black text-black"
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, url: e.target.value } : p))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black text-black"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, description: e.target.value } : p))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black text-black"
                  />
                  <input
                    type="text"
                    value={project.tech_stack}
                    onChange={(e) => setProjects(projects.map((p) => p.id === project.id ? { ...p, tech_stack: e.target.value } : p))}
                    placeholder="React, TypeScript, ..."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black text-black"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(project.id)}
                      disabled={saving}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-lg font-bold text-navy-800 mb-2 pr-8">{project.name}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline text-sm flex items-center gap-1 mb-3"
                  >
                    {project.url.replace('https://', '')}
                    <ExternalLink size={14} />
                  </a>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  )}
                  {project.tech_stack && (
                    <p className="text-xs text-gray-500 mb-3">
                      <span className="font-semibold">Tech:</span> {project.tech_stack}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{project.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(project.id, project.is_featured)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        title={project.is_featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star size={16} className={project.is_featured ? 'fill-yellow-500' : ''} />
                      </button>
                      <button
                        onClick={() => setEditingId(project.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
