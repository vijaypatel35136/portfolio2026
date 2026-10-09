import { useState, useEffect } from 'react'
import { FileText, Upload, Trash2, Check, Loader, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { getResumes, uploadResumeFile, setActiveResume, deleteResumeFile, Resume } from '../../services/resumeService'

interface ResumeManagerProps {
  onUpdate: () => void
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function ResumeManager({ onUpdate, onToast, darkMode = true }: ResumeManagerProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  async function fetchResumes() {
    try {
      const data = await getResumes()
      setResumes(data)
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
      await uploadResumeFile(file)
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
      await setActiveResume(resumeId)
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
      await deleteResumeFile(resumeId)
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
        className={`rounded-xl border p-8 text-center ${
          darkMode
            ? 'bg-navy-800 border-navy-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <Loader className={`animate-spin mx-auto ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} size={32} />
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading resumes...</p>
      </motion.div>
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
      }`}>Resume Management</h2>

      <div className="mb-6">
        <label className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors cursor-pointer w-fit ${
          darkMode
            ? 'bg-teal-900/30 text-teal-400 hover:bg-teal-900/50'
            : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
        }`}>
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
        <p className={`text-sm mt-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Upload your resume PDF. Files are stored securely in Supabase Storage.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
          darkMode
            ? 'bg-navy-900/30 border-navy-700'
            : 'bg-gray-50 border-gray-300'
        }`}>
          <FileText className={`mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={48} />
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No resumes uploaded yet</p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload your first resume to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-navy-800'
          }`}>
            Uploaded Resumes ({resumes.length})
          </h3>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                resume.is_active
                  ? darkMode
                    ? 'border-teal-500 bg-teal-900/30'
                    : 'border-teal-500 bg-teal-50'
                  : darkMode
                    ? 'border-navy-700 bg-navy-900/30 hover:border-navy-600'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <FileText className={`flex-shrink-0 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} size={24} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold flex items-center gap-2 truncate ${
                    darkMode ? 'text-white' : 'text-navy-800'
                  }`}>
                    {resume.original_name}
                    {resume.is_active && (
                      <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded flex-shrink-0">
                        Active
                      </span>
                    )}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    darkMode
                      ? 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  View
                </a>
                <a
                  href={resume.public_url}
                  download={resume.original_name}
                  className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1 ${
                    darkMode
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  title="Download resume"
                >
                  <Download size={14} />
                  Download
                </a>
                {!resume.is_active && (
                  <button
                    onClick={() => handleSetActive(resume.id)}
                    className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1 ${
                      darkMode
                        ? 'bg-teal-900/30 text-teal-400 hover:bg-teal-900/50'
                        : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                    }`}
                  >
                    <Check size={14} />
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    darkMode
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title="Delete resume"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-6 pt-6 border-t ${
        darkMode ? 'border-navy-700' : 'border-gray-200'
      }`}>
        <div className={`border rounded-lg p-4 ${
          darkMode
            ? 'bg-blue-900/20 border-blue-900/30'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
            darkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>
            <FileText size={16} />
            How Resume Management Works
          </h4>
          <ul className={`text-sm space-y-1 ${
            darkMode ? 'text-blue-200' : 'text-blue-800'
          }`}>
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
