/**
 * Test Supabase/PostgreSQL connection
 */

import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔍 Testing Supabase connection...\n')

console.log('Connection details:')
console.log(`Host: ${process.env.DB_HOST}`)
console.log(`Port: ${process.env.DB_PORT}`)
console.log(`Database: ${process.env.DB_NAME}`)
console.log(`User: ${process.env.DB_USER}`)
console.log(`Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET'}`)
console.log('')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
})

async function testConnection() {
  let client
  try {
    console.log('Connecting to database...')
    client = await pool.connect()
    console.log('✅ Successfully connected to Supabase!\n')

    // Test query
    const result = await client.query('SELECT NOW() as current_time')
    console.log('✅ Query test successful')
    console.log(`Current database time: ${result.rows[0].current_time}\n`)

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 Existing tables:')
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    } else {
      console.log('📋 No tables found (database is empty)')
      console.log('   Run: npm run db:init to create tables')
    }

  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check your internet connection')
    console.error('2. Verify Supabase credentials in .env file')
    console.error('3. Make sure your Supabase project is active')
    console.error('4. Check if your IP is allowed in Supabase dashboard')
    process.exit(1)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

testConnection()
