import { useState, useEffect } from 'react'
import { Save, Loader, Upload, Trash2, Check, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { getProfile, updateProfile } from '../../services/profileService'
import { getResumes, uploadResumeFile, setActiveResume, deleteResumeFile, Resume } from '../../services/resumeService'

interface ProfileForm {
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
}


interface ProfileManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function ProfileManager({ onUpdate, onToast, darkMode = true }: ProfileManagerProps) {
  const [profile, setProfile] = useState<ProfileForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchResumes()
  }, [])

  async function fetchProfile() {
    try {
      const data = await getProfile()
      if (data) {
        setProfile({
          name: data.name || '',
          tagline_roles: data.tagline_roles || [],
          summary: data.summary || '',
          email: data.email || '',
          phone: data.phone || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          location: data.location || '',
          experience_years: data.experience_years || 0,
          experience_months: data.experience_months || 0,
          projects_count: data.projects_count || 0,
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchResumes() {
    try {
      const data = await getResumes()
      setResumes(data)
    } catch (err) {
      console.error('Error fetching resumes:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    // Validate required fields
    if (!profile.name || profile.name.trim() === '') {
      onToast?.('Name is required', 'error')
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        name: profile.name.trim(),
        tagline_roles: profile.tagline_roles,
        summary: profile.summary,
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin,
        github: profile.github,
        location: profile.location,
        experience_years: profile.experience_years,
        experience_months: profile.experience_months,
        projects_count: profile.projects_count,
      })
      await fetchProfile()
      onToast?.('Profile updated successfully!', 'success')
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error updating profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      onToast?.('Only PDF files are allowed', 'error')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      onToast?.('File size must be less than 10MB', 'error')
      return
    }

    setUploading(true)
    try {
      await uploadResumeFile(file)
      onToast?.('Resume uploaded successfully!', 'success')
      await fetchResumes()
      e.target.value = '' // Reset file input
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error uploading resume', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSetActive = async (resumeId: number) => {
    try {
      await setActiveResume(resumeId)
      onToast?.('Active resume updated!', 'success')
      await fetchResumes()
      await fetchProfile()
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error setting active resume', 'error')
    }
  }

  const handleDeleteResume = async (resumeId: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      await deleteResumeFile(resumeId)

      onToast?.('Resume deleted successfully!', 'success')
      await fetchResumes()
      await fetchProfile()
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error deleting resume', 'error')
    }
  }

  const handleRoleChange = (index: number, value: string) => {
    if (!profile) return
    const newRoles = [...profile.tagline_roles]
    newRoles[index] = value
    setProfile({ ...profile, tagline_roles: newRoles })
  }

  const addRole = () => {
    if (!profile) return
    setProfile({ ...profile, tagline_roles: [...profile.tagline_roles, ''] })
  }

  const removeRole = (index: number) => {
    if (!profile) return
    setProfile({ ...profile, tagline_roles: profile.tagline_roles.filter((_, i) => i !== index) })
  }

  if (loading) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}>
        <p className="text-red-500">Failed to load profile</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-8 ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <h2 className={`font-heading text-2xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-navy-800'
      }`}>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-navy-800'
            }`}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
            }`}>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode
                  ? 'bg-navy-700 border-navy-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-black'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-navy-800'
          }`}>Tagline Roles</label>
          <div className="space-y-2">
            {profile.tagline_roles.map((role, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-black'
                  }`}
                  placeholder="e.g., Shopify Developer"
                />
                <button
                  type="button"
                  onClick={() => removeRole(index)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRole}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-teal-900/30 text-teal-400 hover:bg-teal-900/50'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }`}
            >
              + Add Role
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-navy-800'
          }`}>Summary / Bio</label>
          <textarea
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
              darkMode
                ? 'bg-navy-700 border-navy-600 text-white'
                : 'bg-gray-50 border-gray-300 text-black'
            }`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-navy-800'
            }`}>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
            }`}>Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode
                  ? 'bg-navy-700 border-navy-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-black'
              }`}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-navy-800'
            }`}>LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
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
            }`}>GitHub / Portfolio URL</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode
                  ? 'bg-navy-700 border-navy-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-black'
              }`}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-navy-800'
            }`}>Years of Experience</label>
            <input
              type="number"
              min={0}
              value={profile.experience_years}
              onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
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
            }`}>Months of Experience</label>
            <input
              type="number"
              min={0}
              max={11}
              value={profile.experience_months}
              onChange={(e) => setProfile({ ...profile, experience_months: parseInt(e.target.value) || 0 })}
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
            }`}>Projects Completed</label>
            <input
              type="number"
              min={0}
              value={profile.projects_count}
              onChange={(e) => setProfile({ ...profile, projects_count: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode
                  ? 'bg-navy-700 border-navy-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-black'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 ${
              darkMode
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
