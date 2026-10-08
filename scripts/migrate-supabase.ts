import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

async function runMigration() {
  console.log('🚀 Starting Supabase Database Migration...')

  const host = process.env.DB_HOST
  const port = parseInt(process.env.DB_PORT || '5432')
  const database = process.env.DB_NAME || 'postgres'
  const user = process.env.DB_USER || 'postgres'
  const password = process.env.DB_PASSWORD

  if (!host || !password) {
    console.error('❌ Error: DB_HOST or DB_PASSWORD is missing in .env file')
    process.exit(1)
  }

  console.log(`📡 Connecting to Supabase PostgreSQL at ${host}:${port}...`)

  const pool = new Pool({
    host,
    port,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    const client = await pool.connect()
    console.log('✅ Connected successfully to Supabase PostgreSQL!')

    const schemaPath = path.resolve(__dirname, '../supabase_schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema file not found at ${schemaPath}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(schemaPath, 'utf8')
    console.log('📜 Executing supabase_schema.sql...')

    await client.query(sql)
    console.log('🎉 Migration completed! All tables, RLS policies, and seed data were created in Supabase!')

    client.release()
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await pool.end()
    console.log('👋 Connection closed.')
  }
}

runMigration()
