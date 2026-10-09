import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../services/experienceService'
import ConfirmationModal from './ConfirmationModal'

interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  description: string
  is_current: boolean
}

interface ExperienceManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
}

export default function ExperienceManager({ onUpdate, onToast }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    is_current: false,
  })
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    try {
      const data = await getExperiences()
      setExperiences(
        data.map((exp) => ({
          id: exp.id!,
          title: exp.title,
          company: exp.company,
          location: exp.location || '',
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          is_current: exp.is_current,
          description: Array.isArray(exp.description)
            ? exp.description.join('\n')
            : String(exp.description || ''),
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
      await createExperience({
        ...formData,
        end_date: formData.is_current ? null : (formData.end_date || null),
        description: formData.description.split('\n').filter((d) => d.trim()),
      })
      setFormData({ title: '', company: '', location: '', start_date: '', end_date: '', description: '', is_current: false })
      setShowAddForm(false)
      await fetchExperiences()
      onUpdate()
      onToast?.('Experience added successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to add experience', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    setSaving(true)
    const exp = experiences.find((e) => e.id === id)
    if (!exp) { setSaving(false); return }
    try {
      await updateExperience(id, {
        title: exp.title,
        company: exp.company,
        location: exp.location,
        start_date: exp.start_date,
        end_date: exp.is_current ? null : exp.end_date,
        is_current: exp.is_current,
        description: typeof exp.description === 'string'
          ? exp.description.split('\n').filter((d) => d.trim())
          : exp.description,
      })
      await fetchExperiences()
      onUpdate()
      setEditingId(null)
      onToast?.('Experience updated successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to update experience', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setSaving(true)
    try {
      await deleteExperience(deleteId)
      await fetchExperiences()
      onUpdate()
      setDeleteId(null)
      onToast?.('Experience deleted successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to delete experience', 'error')
    } finally {
      setSaving(false)
    }
  }

  function parseDescription(desc: string): string[] {
    return desc.split('\n').filter((s) => s.trim())
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading experiences...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Experience"
        message="Are you sure you want to delete this experience entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl font-bold text-navy-800">Experience Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="font-heading text-lg font-semibold text-navy-800 mb-4">Add New Experience</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.is_current}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_current"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="is_current" className="text-sm text-gray-700">I currently work here</label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-800 mb-2">
                Description (one bullet per line)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Built Shopify storefronts using Liquid&#10;Integrated third-party APIs&#10;..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
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
                {saving ? 'Saving...' : 'Add Experience'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-xl border border-gray-200 p-6">
            {editingId === exp.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, title: e.target.value } : x))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm text-black"
                    placeholder="Job title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm text-black"
                    placeholder="Company"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, location: e.target.value } : x))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm text-black"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    value={exp.start_date}
                    onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, start_date: e.target.value } : x))}
                    className="px-3 py-2 border border-gray-300 rounded text-sm text-black"
                    placeholder="Start date"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => setExperiences(experiences.map((x) => x.id === exp.id ? { ...x, description: e.target.value } : x))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
                  placeholder="One bullet per line"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(exp.id)}
                    disabled={saving}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-navy-800">{exp.title}</h3>
                      <p className="text-teal-600 font-semibold">{exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.start_date} → {exp.is_current ? 'Present' : exp.end_date || ''}
                        {exp.is_current && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Current</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(exp.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(exp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="pl-16">
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {parseDescription(exp.description).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
