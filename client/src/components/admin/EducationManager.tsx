import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { getEducation, createEducation, updateEducation, deleteEducation } from '../../services/educationService'
import ConfirmationModal from './ConfirmationModal'

interface Education {
  id: number
  degree: string
  institution: string
  location: string
  start_date: string
  end_date: string | null
  gpa: string | null
  description?: string
}

interface EducationManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function EducationManager({ onUpdate, onToast, darkMode = true }: EducationManagerProps) {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    gpa: '',
    description: '',
  })
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchEducations()
  }, [])

  async function fetchEducations() {
    try {
      const data = await getEducation()
      setEducations(
        data.map((edu) => ({
          id: edu.id!,
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || '',
          start_date: edu.start_date,
          end_date: edu.end_date || null,
          gpa: edu.gpa || null,
          description: edu.description || undefined,
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
      await createEducation({
        ...formData,
        end_date: formData.end_date || null,
        gpa: formData.gpa || null,
        description: formData.description || undefined,
      })
      setFormData({ degree: '', institution: '', location: '', start_date: '', end_date: '', gpa: '', description: '' })
      setShowAddForm(false)
      await fetchEducations()
      onUpdate()
      onToast?.('Education added successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to add education', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    setSaving(true)
    const edu = educations.find((e) => e.id === id)
    if (!edu) { setSaving(false); return }
    try {
      await updateEducation(id, { ...edu })
      await fetchEducations()
      onUpdate()
      setEditingId(null)
      onToast?.('Education updated successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to update education', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setSaving(true)
    try {
      await deleteEducation(deleteId)
      await fetchEducations()
      onUpdate()
      setDeleteId(null)
      onToast?.('Education deleted successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to delete education', 'error')
    } finally {
      setSaving(false)
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
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading education...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex justify-between items-center">
        <h2 className={`font-heading text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-navy-800'
        }`}>Education Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

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
          }`}>Add New Education</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Computer Science"
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
                }`}>Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., University of Technology"
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
              }`}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Ahmedabad, Gujarat"
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
                }`}>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
                }`}>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                placeholder="Describe your studies, achievements, etc."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-navy-700 border-navy-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-black'
                }`}
              />
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
                {saving ? 'Saving...' : 'Add Education'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className={`rounded-xl border p-6 ${
            darkMode
              ? 'bg-navy-800 border-navy-700'
              : 'bg-white border-gray-200'
          }`}>
            {editingId === edu.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, degree: e.target.value } : item))}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, institution: e.target.value } : item))}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Institution"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, location: e.target.value } : item))}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Location"
                  />
                  <input
                    type="date"
                    value={edu.start_date}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, start_date: e.target.value } : item))}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={edu.end_date || ''}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, end_date: e.target.value || null } : item))}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                  />
                  <textarea
                    value={edu.description || ''}
                    onChange={(e) => setEducations(educations.map((item) => item.id === edu.id ? { ...item, description: e.target.value } : item))}
                    rows={2}
                    className={`px-3 py-2 border rounded text-sm ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white'
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Description"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(edu.id)}
                    disabled={saving}
                    className={`p-2 rounded transition-colors disabled:opacity-50 ${
                      darkMode
                        ? 'text-green-400 hover:bg-green-900/30'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className={`p-2 rounded transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:bg-navy-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      darkMode
                        ? 'bg-teal-900/30 text-teal-400'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className={`font-heading text-lg font-bold ${
                        darkMode ? 'text-white' : 'text-navy-800'
                      }`}>{edu.degree}</h3>
                      <p className={`font-semibold ${
                        darkMode ? 'text-teal-400' : 'text-teal-600'
                      }`}>{edu.institution}</p>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{edu.location}</p>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {edu.start_date} – {edu.end_date || 'Present'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(edu.id)}
                      className={`p-2 rounded transition-colors ${
                        darkMode
                          ? 'text-blue-400 hover:bg-blue-900/30'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(edu.id)}
                      className={`p-2 rounded transition-colors ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {edu.description && (
                  <div className="pl-16">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>{edu.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
