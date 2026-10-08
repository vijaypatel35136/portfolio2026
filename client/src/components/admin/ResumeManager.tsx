import { useState, useEffect } from 'react'
import { FileText, Upload, Trash2, Check, Loader } from 'lucide-react'
import { motion } from 'framer-motion'

interface Resume {
  id: number
  filename: string
  original_name: string
  public_url: string
  file_size: number
  is_active: boolean
  uploaded_at: string
}

interface ResumeManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
}

export default function ResumeManager({ onUpdate, onToast }: ResumeManagerProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  async function fetchResumes() {
    try {
      const token = localStorage.getItem('portfolio_admin_token')
      const response = await fetch('/api/resumes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (err) {
      console.error('Error fetching resumes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const token = localStorage.getItem('portfolio_admin_token')
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }

      onToast?.('Resume uploaded successfully!', 'success')
      await fetchResumes()
      onUpdate()
      e.target.value = '' // Reset file input
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error uploading resume', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSetActive = async (resumeId: number) => {
    try {
      const token = localStorage.getItem('portfolio_admin_token')
      const response = await fetch(`/api/resumes/${resumeId}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to set active resume')
      }

      onToast?.('Active resume updated!', 'success')
      await fetchResumes()
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error setting active resume', 'error')
    }
  }

  const handleDeleteResume = async (resumeId: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const token = localStorage.getItem('portfolio_admin_token')
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete resume')
      }

      onToast?.('Resume deleted successfully!', 'success')
      await fetchResumes()
      onUpdate()
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : 'Error deleting resume', 'error')
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 text-center"
      >
        <Loader className="animate-spin mx-auto text-teal-600" size={32} />
        <p className="text-gray-500 mt-4">Loading resumes...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-8"
    >
      <h2 className="font-heading text-2xl font-bold text-navy-800 mb-6">Resume Management</h2>

      <div className="mb-6">
        <label className="flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer w-fit">
          {uploading ? (
            <>
              <Loader className="animate-spin" size={18} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload New Resume (PDF, max 10MB)
            </>
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Upload your resume PDF. Files are stored securely in Supabase Storage.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="text-gray-400 mx-auto mb-3" size={48} />
          <p className="text-gray-600 font-medium">No resumes uploaded yet</p>
          <p className="text-sm text-gray-500 mt-1">Upload your first resume to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">
            Uploaded Resumes ({resumes.length})
          </h3>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                resume.is_active
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText className="text-teal-600 flex-shrink-0" size={24} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-800 flex items-center gap-2 truncate">
                    {resume.original_name}
                    {resume.is_active && (
                      <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded flex-shrink-0">
                        Active
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(resume.file_size / 1024).toFixed(0)} KB • Uploaded{' '}
                    {new Date(resume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={resume.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  View
                </a>
                {!resume.is_active && (
                  <button
                    onClick={() => handleSetActive(resume.id)}
                    className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} />
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  title="Delete resume"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FileText size={16} />
            How Resume Management Works
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload multiple resume versions (max 10MB each)</li>
            <li>• Set one resume as "Active" - this will appear on your portfolio</li>
            <li>• Delete old resumes - removes from database and storage</li>
            <li>• All files are stored securely in Supabase Storage</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
