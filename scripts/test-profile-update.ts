import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { queryOne, run } from '../server/db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

async function testProfileUpdate() {
  console.log('🧪 Testing Profile Update...\n')

  try {
    // 1. Check if profile exists
    console.log('1️⃣ Checking existing profile...')
    const existing = await queryOne('SELECT * FROM profile WHERE id = 1')
    
    if (existing) {
      console.log('✅ Profile exists:')
      console.log(`   - Name: ${existing.name}`)
      console.log(`   - Email: ${existing.email}`)
      console.log(`   - Location: ${existing.location}`)
      console.log(`   - Resume PDF: ${existing.resume_pdf || 'None'}`)
    } else {
      console.log('❌ No profile found with id = 1')
    }

    // 2. Test profile update with all fields
    console.log('\n2️⃣ Testing profile update...')
    const testData = {
      name: 'Vijay Kumar',
      tagline_roles: JSON.stringify(['Shopify Developer', 'Full Stack Developer']),
      summary: 'Test summary',
      profile_photo: null,
      resume_pdf: null,
      email: 'vijay@example.com',
      phone: '+1234567890',
      linkedin: 'https://linkedin.com/in/vijay',
      github: 'https://github.com/vijay',
      location: 'India',
      experience_years: 5,
      projects_count: 20,
      education: 'Bachelor of Technology'
    }

    if (existing) {
      await run(`
        UPDATE profile SET 
          name = $1, 
          tagline_roles = $2, 
          summary = $3,
          profile_photo = COALESCE($4, profile_photo),
          resume_pdf = COALESCE($5, resume_pdf),
          email = $6,
          phone = $7,
          linkedin = $8,
          github = $9,
          location = $10,
          experience_years = $11,
          projects_count = $12,
          education = $13,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        testData.name,
        testData.tagline_roles,
        testData.summary,
        testData.profile_photo,
        testData.resume_pdf,
        testData.email,
        testData.phone,
        testData.linkedin,
        testData.github,
        testData.location,
        testData.experience_years,
        testData.projects_count,
        testData.education
      ])
      console.log('✅ Profile updated successfully')
    } else {
      await run(`
        INSERT INTO profile (id, name, tagline_roles, summary, profile_photo, resume_pdf, email, phone, linkedin, github, location, experience_years, projects_count, education)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        testData.name,
        testData.tagline_roles,
        testData.summary,
        testData.profile_photo,
        testData.resume_pdf,
        testData.email,
        testData.phone,
        testData.linkedin,
        testData.github,
        testData.location,
        testData.experience_years,
        testData.projects_count,
        testData.education
      ])
      console.log('✅ Profile created successfully')
    }

    // 3. Verify the update
    console.log('\n3️⃣ Verifying update...')
    const updated = await queryOne('SELECT * FROM profile WHERE id = 1')
    
    if (updated) {
      console.log('✅ Profile after update:')
      console.log(`   - Name: ${updated.name}`)
      console.log(`   - Email: ${updated.email}`)
      console.log(`   - Location: ${updated.location}`)
      console.log(`   - Experience: ${updated.experience_years} years`)
      console.log(`   - Projects: ${updated.projects_count}`)
      console.log(`   - Updated At: ${updated.updated_at}`)
    }

    // 4. Check resumes table
    console.log('\n4️⃣ Checking resumes table...')
    const { Pool } = await import('pg')
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const resumesResult = await pool.query('SELECT * FROM resumes ORDER BY uploaded_at DESC')
    if (resumesResult.rows.length > 0) {
      console.log(`✅ Found ${resumesResult.rows.length} resume(s):`)
      resumesResult.rows.forEach((resume, idx) => {
        console.log(`   ${idx + 1}. ${resume.original_name} (${resume.is_active ? 'Active' : 'Inactive'})`)
        console.log(`      - URL: ${resume.public_url}`)
        console.log(`      - Size: ${(resume.file_size / 1024).toFixed(0)} KB`)
      })
    } else {
      console.log('ℹ️  No resumes uploaded yet')
    }

    await pool.end()

    console.log('\n✅ All tests passed!')

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message)
    console.error('Error details:', error)
    process.exit(1)
  }
}

testProfileUpdate()
