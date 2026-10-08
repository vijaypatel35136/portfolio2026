import { supabase } from '../lib/supabase'

export interface Resume {
  id: number
  filename: string
  original_name: string
  file_path: string
  public_url: string
  file_size: number
  is_active: boolean
  uploaded_at: string
}

const BUCKET_NAME = 'portfolio-files'

export async function getResumes(): Promise<Resume[]> {
  // First try backend API endpoint if running with Express server
  try {
    const token = localStorage.getItem('portfolio_admin_token')
    const response = await fetch('/api/resumes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (err) {
    // Fallback to Supabase direct client for GitHub Pages
  }

  // Supabase direct fallback
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('is_active', { ascending: false })
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching resumes from Supabase:', error)
    return []
  }
  return data || []
}

export async function uploadResumeFile(file: File): Promise<Resume> {
  const token = localStorage.getItem('portfolio_admin_token')
  
  // Try Express server backend endpoint first
  try {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await fetch('/api/resumes/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (err) {
    // Fallback to direct Supabase upload (for GitHub Pages static site)
  }

  // Direct Supabase storage & database upload fallback
  const filePath = `resumes/${Date.now()}-${file.name}`

  // 1. Upload to Supabase Storage bucket 'portfolio-files'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: 'application/pdf',
      upsert: false
    })

  if (uploadError) throw new Error(uploadError.message || 'Failed to upload to Supabase storage')

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  // 3. Insert metadata row into Supabase 'resumes' table
  const { data: insertedData, error: dbError } = await supabase
    .from('resumes')
    .insert([{
      filename: file.name,
      original_name: file.name,
      file_path: filePath,
      public_url: publicUrl,
      file_size: file.size,
      is_active: false
    }])
    .select()
    .single()

  if (dbError) throw new Error(dbError.message || 'Failed to save resume record in Supabase database')

  return insertedData
}

export async function setActiveResume(resumeId: number): Promise<void> {
  const token = localStorage.getItem('portfolio_admin_token')

  // Try Express backend server endpoint
  try {
    const response = await fetch(`/api/resumes/${resumeId}/activate`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) return
  } catch (err) {
    // Fallback to Supabase direct
  }

  // Direct Supabase database fallback
  await supabase.from('resumes').update({ is_active: false }).neq('id', 0)
  const { data: active, error: activeErr } = await supabase
    .from('resumes')
    .update({ is_active: true })
    .eq('id', resumeId)
    .select()
    .single()

  if (activeErr) throw activeErr

  if (active?.public_url) {
    await supabase.from('profile').update({ resume_pdf: active.public_url }).eq('id', 1)
  }
}

export async function deleteResumeFile(resumeId: number): Promise<void> {
  const token = localStorage.getItem('portfolio_admin_token')

  // Try Express backend server endpoint
  try {
    const response = await fetch(`/api/resumes/${resumeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) return
  } catch (err) {
    // Fallback to Supabase direct
  }

  // Direct Supabase database fallback
  const { data: resume } = await supabase
    .from('resumes')
    .select('file_path, is_active')
    .eq('id', resumeId)
    .single()

  if (resume?.file_path) {
    await supabase.storage.from(BUCKET_NAME).remove([resume.file_path])
  }

  await supabase.from('resumes').delete().eq('id', resumeId)

  if (resume?.is_active) {
    await supabase.from('profile').update({ resume_pdf: null }).eq('id', 1)
  }
}
