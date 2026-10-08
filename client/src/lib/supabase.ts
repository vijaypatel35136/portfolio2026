import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wafakfhbskakncbcnmmg.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KD_kPFznl99UK8lAs7ZpYQ_l1E5OfLS'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
