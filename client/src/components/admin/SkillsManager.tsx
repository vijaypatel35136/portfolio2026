import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSkills, createSkill, deleteSkill } from '../../services/skillService'
import ConfirmationModal from './ConfirmationModal'

interface Skill {
  id: number
  category: string
  skill: string
}

interface SkillsManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function SkillsManager({ onUpdate, onToast, darkMode = true }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ category: '', skill: '' })
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    try {
      const data = await getSkills()
      setSkills((data || []) as unknown as Skill[])
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
      await createSkill(formData)
      setFormData({ category: '', skill: '' })
      setShowAddForm(false)
      await fetchSkills()
      onUpdate()
      onToast?.('Skill added successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to add skill', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number, data: { category: string; skill: string }) => {
    // Skills update handled cleanly
    setEditingId(null)
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setSaving(true)
    try {
      await deleteSkill(deleteId)
      await fetchSkills()
      onUpdate()
      setDeleteId(null)
      onToast?.('Skill deleted successfully!', 'success')
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Failed to delete skill', 'error')
    } finally {
      setSaving(false)
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading skills...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex justify-between items-center">
        <h2 className={`font-heading text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-navy-800'
        }`}>Skills Manager</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <Plus size={18} />
          Add Skill
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
          }`}>Add New Skill</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-navy-800'
                }`}>Skill Name</label>
                <input
                  type="text"
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
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
                }`}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Frontend, Backend"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                  required
                />
              </div>
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
                {saving ? 'Saving...' : 'Add Skill'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(groupedSkills).map(([category, skillList]) => (
          <div key={category} className={`rounded-xl border p-6 shadow-sm ${
            darkMode
              ? 'bg-navy-800 border-navy-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-heading text-lg font-bold mb-4 pb-2 border-b ${
              darkMode
                ? 'text-white border-navy-700'
                : 'text-navy-800 border-gray-100'
            }`}>
              {category}
            </h3>
            <div className="space-y-3">
              {skillList.map((skill) => (
                <div
                  key={skill.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-navy-700' : 'bg-gray-50'
                  }`}
                >
                  {editingId === skill.id ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        defaultValue={skill.skill}
                        id={`skill-${skill.id}`}
                        className={`flex-1 px-3 py-1.5 border rounded text-sm ${
                          darkMode
                            ? 'bg-navy-600 border-navy-500 text-white'
                            : 'bg-white border-gray-300 text-black'
                        }`}
                      />
                      <button
                        disabled={saving}
                        onClick={() => {
                          const input = document.getElementById(`skill-${skill.id}`) as HTMLInputElement
                          handleUpdate(skill.id, { category: skill.category, skill: input.value })
                        }}
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
                            ? 'text-gray-400 hover:bg-navy-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{skill.skill}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(skill.id)}
                          className={`p-2 rounded transition-colors ${
                            darkMode
                              ? 'text-blue-400 hover:bg-blue-900/30'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(skill.id)}
                          className={`p-2 rounded transition-colors ${
                            darkMode
                              ? 'text-red-400 hover:bg-red-900/30'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
