import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (err) {
    console.error('⚠️ Failed to initialize Supabase client:', err)
  }
} else {
  console.warn('⚠️ Supabase credentials missing. VITE_SUPABASE_URL or keys are not set in .env')
}

const BUCKET_NAME = 'portfolio-files'

/**
 * Initialize storage bucket
 */
export async function initializeBucket() {
  try {
    if (!supabase) {
      console.warn('⚠️ Cannot initialize bucket: Supabase client is not configured.')
      return
    }
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (error) {
        console.error('Failed to create bucket:', error)
      } else {
        console.log('✅ Supabase Storage bucket created:', BUCKET_NAME)
      }
    }
  } catch (error) {
    console.error('Error initializing bucket:', error)
  }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(file: Buffer, filename: string, folder: string = 'resumes') {
  try {
    console.log('📤 Starting upload...')
    console.log('   - Filename:', filename)
    console.log('   - Folder:', folder)
    console.log('   - File size:', file.length, 'bytes')
    console.log('   - Bucket:', BUCKET_NAME)
    
    const filePath = `${folder}/${Date.now()}-${filename}`
    console.log('   - Full path:', filePath)
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('❌ Upload error from Supabase:', error)
      throw error
    }
    
    console.log('✅ File uploaded successfully:', data.path)
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)
    
    console.log('✅ Public URL generated:', publicUrl)
    
    return {
      path: data.path,
      publicUrl,
      filename
    }
  } catch (error) {
    console.error('❌ Upload error:', error)
    throw error
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

/**
 * List files in a folder
 */
export async function listFiles(folder: string = 'resumes') {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (error) {
      throw error
    }
    
    return data.map(file => ({
      name: file.name,
      path: `${folder}/${file.name}`,
      size: file.metadata?.size || 0,
      created_at: file.created_at,
      publicUrl: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folder}/${file.name}`).data.publicUrl
    }))
  } catch (error) {
    console.error('List files error:', error)
    throw error
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(filePath: string) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

export default supabase
