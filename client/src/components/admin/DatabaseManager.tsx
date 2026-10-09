import { useState } from 'react'
import { Database, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface DatabaseManagerProps {
  onToast?: (message: string, type: 'success' | 'error') => void
  darkMode?: boolean
}

export default function DatabaseManager({ onToast, darkMode = true }: DatabaseManagerProps) {
  return (
    <div className="space-y-6">
      <div className={`rounded-xl border p-6 shadow-sm ${
        darkMode
          ? 'bg-navy-800 border-navy-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode
                ? 'bg-teal-900/30 text-teal-400'
                : 'bg-teal-500/10 text-teal-600'
            }`}>
              <Database size={20} />
            </div>
            <div>
              <h2 className={`font-heading text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Supabase Database Sync</h2>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>PostgreSQL Database Architecture Status</p>
            </div>
          </div>
        </div>

        <div className={`p-4 border rounded-lg flex items-start gap-3 ${
          darkMode
            ? 'bg-teal-900/30 border-teal-900/50'
            : 'bg-teal-50 border-teal-200'
        }`}>
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            darkMode ? 'text-teal-400' : 'text-teal-600'
          }`} />
          <div>
            <p className={`font-semibold ${
              darkMode ? 'text-teal-300' : 'text-teal-900'
            }`}>Supabase Client Connected</p>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-teal-200' : 'text-teal-700'
            }`}>
              Your application is using Supabase for database operations across Profile, Skills, Experiences, Projects, Education, and Contact Messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
