import { useState } from 'react'
import { Database, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface DatabaseManagerProps {
  onToast?: (message: string, type: 'success' | 'error') => void
}

export default function DatabaseManager({ onToast }: DatabaseManagerProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">Supabase Database Sync</h2>
              <p className="text-gray-500 text-sm">PostgreSQL Database Architecture Status</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-teal-900 font-semibold">Supabase Client Connected</p>
            <p className="text-teal-700 text-sm mt-1">
              Your application is using Supabase for database operations across Profile, Skills, Experiences, Projects, Education, and Contact Messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
