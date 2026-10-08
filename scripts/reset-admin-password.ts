/**
 * Reset admin password
 */

import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
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

async function resetAdminPassword() {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Resetting admin password...\n')
    
    // Check if admin exists
    const result = await client.query("SELECT * FROM admin WHERE email = $1", ['admin@vijay.dev'])
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found. Creating new admin...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await client.query("INSERT INTO admin (email, password) VALUES ($1, $2)", ['admin@vijay.dev', hashedPassword])
      console.log('✅ Admin user created')
    } else {
      console.log('✅ Admin user found')
      console.log(`   Email: ${result.rows[0].email}`)
      console.log(`   ID: ${result.rows[0].id}`)
      console.log(`   Created: ${result.rows[0].created_at}`)
      
      // Reset password
      const newPassword = 'admin123'
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await client.query("UPDATE admin SET password = $1 WHERE email = $2", [hashedPassword, 'admin@vijay.dev'])
      console.log('\n✅ Password reset successfully!')
    }
    
    console.log('\n📝 Login credentials:')
    console.log('   Email: admin@vijay.dev')
    console.log('   Password: admin123')
    console.log('\n🔗 Login at: http://localhost:5173/admin/login')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

resetAdminPassword()
