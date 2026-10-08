/**
 * Pre-deployment checklist
 * Run this before pushing to GitHub to ensure everything is ready
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🔍 Running pre-deployment checklist...\n')

let hasErrors = false

// Check 1: Database file exists
console.log('1. Checking database file...')
const dbPath = path.join(rootDir, 'data', 'portfolio.db')
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath)
  console.log(`   ✅ Database found (${(stats.size / 1024).toFixed(2)} KB)`)
} else {
  console.log('   ❌ Database file not found at data/portfolio.db')
  console.log('   Run: npm run db:init')
  hasErrors = true
}

// Check 2: node_modules exists
console.log('\n2. Checking dependencies...')
const nodeModulesPath = path.join(rootDir, 'node_modules')
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ Dependencies installed')
} else {
  console.log('   ❌ node_modules not found')
  console.log('   Run: npm install')
  hasErrors = true
}

// Check 3: .env file exists
console.log('\n3. Checking environment variables...')
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  if (envContent.includes('JWT_SECRET')) {
    console.log('   ✅ JWT_SECRET configured')
  } else {
    console.log('   ⚠️  JWT_SECRET not found in .env')
  }
} else {
  console.log('   ⚠️  .env file not found (okay for deployment, but needed for local dev)')
}

// Check 4: Deployment config files
console.log('\n4. Checking deployment configurations...')
const deployConfigs = [
  { file: 'vercel.json', platform: 'Vercel' },
  { file: 'netlify.toml', platform: 'Netlify' },
  { file: '.env.production.example', platform: 'Production' }
]

for (const config of deployConfigs) {
  const configPath = path.join(rootDir, config.file)
  if (fs.existsSync(configPath)) {
    console.log(`   ✅ ${config.file} ready for ${config.platform}`)
  } else {
    console.log(`   ⚠️  ${config.file} not found`)
  }
}

// Check 5: Build scripts
console.log('\n5. Checking build scripts...')
const packageJsonPath = path.join(rootDir, 'package.json')
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const requiredScripts = ['build', 'build:server', 'dev', 'start', 'db:init']
  
  for (const script of requiredScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ Script "${script}" defined`)
    } else {
      console.log(`   ❌ Script "${script}" missing`)
      hasErrors = true
    }
  }
}

// Check 6: Required dependencies
console.log('\n6. Checking required dependencies...')
const packageJsonPath2 = path.join(rootDir, 'package.json')
if (fs.existsSync(packageJsonPath2)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath2, 'utf-8'))
  const requiredDeps = ['express', 'sql.js', 'bcryptjs', 'jsonwebtoken', 'react', 'react-dom']
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} installed`)
    } else {
      console.log(`   ❌ ${dep} missing`)
      hasErrors = true
    }
  }
}

// Check 7: .gitignore
console.log('\n7. Checking .gitignore...')
const gitignorePath = path.join(rootDir, '.gitignore')
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8')
  console.log('   ✅ .gitignore exists')
  
  // Make sure database is NOT ignored
  if (!gitignoreContent.includes('*.db') && !gitignoreContent.includes('data/*.db')) {
    console.log('   ✅ Database files will be committed')
  } else {
    console.log('   ⚠️  Database files might be ignored')
  }
  
  // Make sure .env IS ignored
  if (gitignoreContent.includes('.env')) {
    console.log('   ✅ .env files are ignored')
  } else {
    console.log('   ⚠️  .env files will be committed (security risk!)')
  }
} else {
  console.log('   ❌ .gitignore not found')
  hasErrors = true
}

// Check 8: Documentation
console.log('\n8. Checking documentation...')
const docs = ['README.md', 'DEPLOYMENT.md', 'GIT_SETUP.md']
for (const doc of docs) {
  const docPath = path.join(rootDir, doc)
  if (fs.existsSync(docPath)) {
    console.log(`   ✅ ${doc} exists`)
  } else {
    console.log(`   ⚠️  ${doc} not found`)
  }
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Some issues need to be fixed before deployment')
  console.log('   Please address the errors above')
  process.exit(1)
} else {
  console.log('✅ All checks passed! Ready for deployment')
  console.log('\nNext steps:')
  console.log('1. git add .')
  console.log('2. git commit -m "Ready for deployment"')
  console.log('3. git push origin main')
  console.log('4. Deploy to your chosen platform (see DEPLOYMENT.md)')
  process.exit(0)
}
