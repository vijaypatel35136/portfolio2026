/**
 * Create resumes table for tracking uploaded resume files
 */

import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})

async function createResumesTable() {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Creating resumes table...\n')
    
    // Create resumes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        public_url TEXT NOT NULL,
        file_size INTEGER,
        is_active BOOLEAN DEFAULT false,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Resumes table created successfully!')
    console.log('\nTable structure:')
    console.log('  - id: Serial primary key')
    console.log('  - filename: Stored filename')
    console.log('  - original_name: Original upload name')
    console.log('  - file_path: Path in Supabase Storage')
    console.log('  - public_url: Public URL to access file')
    console.log('  - file_size: File size in bytes')
    console.log('  - is_active: Which resume is currently active')
    console.log('  - uploaded_at: Upload timestamp')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

createResumesTable()
