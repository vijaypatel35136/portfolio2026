export interface Profile {
  id?: number
  name: string
  title?: string
  tagline?: string
  tagline_roles: string[]
  summary?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  location?: string
  profile_photo?: string
  resume_pdf?: string
  experience_years: number
  experience_months: number
  projects_count: number
  education?: string
  updated_at?: string
}

export interface Skill {
  id?: number
  category: string
  skill: string
  display_order?: number
  created_at?: string
}

export interface Experience {
  id?: number
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string | null
  description: string | string[]
  is_current: boolean
  display_order?: number
  created_at?: string
}

export interface Project {
  id?: number
  name: string
  description: string
  category?: string
  image_url?: string
  github_url?: string
  url?: string
  tech_stack: string[]
  is_featured: boolean
  display_order?: number
  created_at?: string
}

export interface Education {
  id?: number
  degree: string
  institution: string
  location?: string
  start_date: string
  end_date?: string | null
  gpa?: string | null
  description?: string
  created_at?: string
}

export interface ContactMessage {
  id?: number
  name: string
  email: string
  message: string
  created_at?: string
  is_read?: boolean
}

export interface ServiceState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
