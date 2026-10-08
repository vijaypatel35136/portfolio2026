import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

async function testSupabaseStorage() {
  console.log('🧪 Testing Supabase Storage...\n')

  // 1. Check environment variables
  console.log('1️⃣ Checking environment variables...')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log(`   - VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - VITE_SUPABASE_PUBLISHABLE_KEY: ${publishableKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Set' : '❌ Not set (optional)'}`)

  if (!supabaseUrl || !publishableKey) {
    console.error('\n❌ Missing required Supabase credentials!')
    process.exit(1)
  }

  // 2. Test with publishable key (what the app uses)
  console.log('\n2️⃣ Testing with publishable key...')
  const supabasePublic = createClient(supabaseUrl, publishableKey)

  try {
    const { data: buckets, error } = await supabasePublic.storage.listBuckets()
    
    if (error) {
      console.error('   ❌ Error listing buckets:', error.message)
    } else {
      console.log(`   ✅ Successfully listed ${buckets?.length || 0} bucket(s)`)
      buckets?.forEach(bucket => {
        console.log(`      - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`)
      })
      
      const portfolioBucket = buckets?.find(b => b.name === 'portfolio-files')
      if (portfolioBucket) {
        console.log('   ✅ portfolio-files bucket exists!')
        console.log(`      - Public: ${portfolioBucket.public}`)
      } else {
        console.log('   ⚠️  portfolio-files bucket NOT found!')
      }
    }
  } catch (err: any) {
    console.error('   ❌ Exception:', err.message)
  }

  // 3. Test file upload with publishable key
  console.log('\n3️⃣ Testing file upload with publishable key...')
  try {
    const testContent = Buffer.from('This is a test PDF file')
    const testFileName = `test-${Date.now()}.pdf`
    const filePath = `resumes/${testFileName}`

    const { data, error } = await supabasePublic.storage
      .from('portfolio-files')
      .upload(filePath, testContent, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (error) {
      console.error('   ❌ Upload failed:', error.message)
      console.error('   Error details:', JSON.stringify(error, null, 2))
      
      if (error.message.includes('row-level security') || error.message.includes('RLS')) {
        console.log('\n   💡 SOLUTION: You need to either:')
        console.log('      1. Add service role key to .env (bypasses RLS)')
        console.log('      2. OR configure RLS policies in Supabase dashboard')
        console.log('\n   📖 See SUPABASE_STORAGE_SETUP.md for details')
      }
    } else {
      console.log('   ✅ Upload successful!')
      console.log('   ✅ File path:', data.path)
      
      // Get public URL
      const { data: { publicUrl } } = supabasePublic.storage
        .from('portfolio-files')
        .getPublicUrl(filePath)
      console.log('   ✅ Public URL:', publicUrl)

      // Clean up test file
      await supabasePublic.storage
        .from('portfolio-files')
        .remove([filePath])
      console.log('   ✅ Test file cleaned up')
    }
  } catch (err: any) {
    console.error('   ❌ Exception:', err.message)
  }

  // 4. If service role key exists, test with it
  if (serviceRoleKey) {
    console.log('\n4️⃣ Testing with service role key...')
    const supabaseService = createClient(supabaseUrl, serviceRoleKey)

    try {
      const testContent = Buffer.from('This is a test PDF file with service role')
      const testFileName = `test-service-${Date.now()}.pdf`
      const filePath = `resumes/${testFileName}`

      const { data, error } = await supabaseService.storage
        .from('portfolio-files')
        .upload(filePath, testContent, {
          contentType: 'application/pdf',
          upsert: false
        })

      if (error) {
        console.error('   ❌ Upload failed:', error.message)
      } else {
        console.log('   ✅ Upload with service role successful!')
        console.log('   ✅ File path:', data.path)

        // Clean up
        await supabaseService.storage
          .from('portfolio-files')
          .remove([filePath])
        console.log('   ✅ Test file cleaned up')
      }
    } catch (err: any) {
      console.error('   ❌ Exception:', err.message)
    }
  }

  console.log('\n✅ Test complete!')
}

testSupabaseStorage()
