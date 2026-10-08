# Portfolio Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Frontend (Port 5173)                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │    │
│  │  │ Public Pages │  │ Admin Login  │  │ Admin Panel │  │    │
│  │  │   - Home     │  │              │  │ - Profile   │  │    │
│  │  │   - About    │  │              │  │ - Resumes   │  │    │
│  │  │   - Contact  │  │              │  │ - Projects  │  │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Port 3001)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      API ROUTES                           │  │
│  │  • /api/auth          - Authentication                    │  │
│  │  • /api/profile       - Profile CRUD                      │  │
│  │  • /api/resumes       - Resume management                 │  │
│  │  • /api/skills        - Skills CRUD                       │  │
│  │  • /api/experience    - Experience CRUD                   │  │
│  │  • /api/projects      - Projects CRUD                     │  │
│  │  • /api/education     - Education CRUD                    │  │
│  │  • /api/contact       - Contact messages                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           │ PostgreSQL                         │ File Upload
           │ Queries                            │ (FormData)
           ↓                                    ↓
┌─────────────────────────┐      ┌──────────────────────────────┐
│   SUPABASE DATABASE     │      │   SUPABASE STORAGE           │
│   (PostgreSQL)          │      │   Bucket: portfolio-files    │
│                         │      │                              │
│  Tables:                │      │  Files:                      │
│  • profile              │      │  • resumes/*.pdf             │
│  • resumes              │◄─────┤  • images/*                  │
│  • skills               │ link │  • documents/*               │
│  • experience           │      │                              │
│  • projects             │      │  Public URLs generated       │
│  • education            │      │  for all files               │
│  • messages             │      │                              │
│  • admin                │      │                              │
└─────────────────────────┘      └──────────────────────────────┘
```

---

## Resume Upload Flow (NEW - Fixed)

### Before (Broken - PayloadTooLarge)
```
User selects PDF file
        ↓
Frontend converts to base64 (~33% larger!)
        ↓
Sends as JSON in HTTP body (too large!)
        ↓
❌ PayloadTooLargeError: request entity too large
```

### After (Working - Using Supabase Storage)
```
User selects PDF file
        ↓
Frontend creates FormData with file
        ↓
POST /api/resumes/upload (multipart/form-data)
        ↓
Server receives file buffer (multer)
        ↓
Upload to Supabase Storage (uploadFile)
        ↓
Get public URL from Supabase
        ↓
Save metadata to database (resumes table)
        ↓
✅ Resume uploaded successfully!
```

---

## Profile Update Flow (Fixed)

### Before (Broken - 400 Bad Request)
```
User fills profile form
        ↓
Duplicate code in component
        ↓
No validation on name field
        ↓
Sends request with empty name
        ↓
❌ 400 Bad Request: "null value in column 'name'"
```

### After (Working)
```
User fills profile form
        ↓
Frontend validates: name is required
        ↓
Clean, single submission handler
        ↓
PUT /api/profile with validated data
        ↓
Backend validates required fields
        ↓
Updates profile in database
        ↓
✅ Profile updated successfully!
```

---

## Data Flow: Resume Management

```
┌──────────────────────────────────────────────────────────────┐
│                    UPLOAD NEW RESUME                          │
└──────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ↓                         ↓                         ↓
┌─────────┐           ┌──────────────┐        ┌──────────────┐
│ Upload  │           │  Save to     │        │  Update      │
│ to      │──────────→│  Database    │───────→│  Profile     │
│ Storage │           │  (resumes)   │        │  table       │
└─────────┘           └──────────────┘        └──────────────┘
  • Stores             • Tracks file           • Links active
    physical             metadata               resume URL
    PDF file           • is_active flag        • resume_pdf
  • Generates          • original_name           field
    public URL         • file_size
                       • uploaded_at

┌──────────────────────────────────────────────────────────────┐
│                    SET ACTIVE RESUME                          │
└──────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ↓                         ↓                         ↓
┌─────────┐           ┌──────────────┐        ┌──────────────┐
│ Set all │           │  Set chosen  │        │  Update      │
│ resumes │──────────→│  resume      │───────→│  profile     │
│ inactive│           │  active      │        │  resume_pdf  │
└─────────┘           └──────────────┘        └──────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    DELETE RESUME                              │
└──────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ↓                         ↓                         ↓
┌─────────┐           ┌──────────────┐        ┌──────────────┐
│ Delete  │           │  Delete from │        │  Clear       │
│ from    │──────────→│  Database    │───────→│  profile     │
│ Storage │           │  (resumes)   │        │  if active   │
└─────────┘           └──────────────┘        └──────────────┘
```

---

## Database Schema

### Profile Table
```sql
profile
  ├─ id (PRIMARY KEY)
  ├─ name (TEXT, NOT NULL) ← Must not be empty!
  ├─ tagline_roles (JSONB)
  ├─ summary (TEXT)
  ├─ email (TEXT)
  ├─ phone (TEXT)
  ├─ linkedin (TEXT)
  ├─ github (TEXT)
  ├─ location (TEXT)
  ├─ profile_photo (TEXT)
  ├─ resume_pdf (TEXT) ← Links to active resume URL
  ├─ experience_years (INTEGER)
  ├─ projects_count (INTEGER)
  ├─ education (TEXT)
  └─ updated_at (TIMESTAMP)
```

### Resumes Table (NEW)
```sql
resumes
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ filename (TEXT) ← Generated unique name
  ├─ original_name (TEXT) ← User's file name
  ├─ file_path (TEXT) ← Path in Supabase Storage
  ├─ public_url (TEXT) ← Public download URL
  ├─ file_size (INTEGER) ← Size in bytes
  ├─ is_active (BOOLEAN) ← Only one can be true
  └─ uploaded_at (TIMESTAMP)
```

---

## API Endpoints

### Profile Management
- `GET /api/profile` - Get profile (public)
- `PUT /api/profile` - Update profile (admin only)

### Resume Management (NEW)
- `GET /api/resumes` - List all resumes (admin)
- `POST /api/resumes/upload` - Upload new resume (admin)
- `PUT /api/resumes/:id/activate` - Set active resume (admin)
- `DELETE /api/resumes/:id` - Delete resume (admin)
- `GET /api/resumes/active` - Get active resume (public)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user

### Other Resources
- Skills: `/api/skills`
- Experience: `/api/experience`
- Projects: `/api/projects`
- Education: `/api/education`
- Messages: `/api/contact`

---

## Environment Variables

```bash
# Server
PORT=3001
JWT_SECRET=your-secret-key

# Supabase (Frontend)
VITE_SUPABASE_URL=https://wafakfhbskakncbcnmmg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Supabase (Backend - optional for auto bucket creation)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Backend)
DB_HOST=aws-0-ap-northeast-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.wafakfhbskakncbcnmmg
DB_PASSWORD=5UvxWdhYptNBnoJN

# Admin
ADMIN_EMAIL=admin@vijay.dev
ADMIN_PASSWORD=admin123
```

---

## Security Model

### Public Routes (No Auth)
- Home page, portfolio view
- Contact form submission
- Active resume download
- Profile data (read-only)

### Protected Routes (Admin Only)
- All `/api/*` POST/PUT/DELETE endpoints
- Admin dashboard
- Resume management
- Content editing

### Authentication Flow
```
Login with credentials
        ↓
Server validates against admin table
        ↓
Generates JWT token
        ↓
Frontend stores in localStorage
        ↓
All admin requests include:
  Authorization: Bearer <token>
        ↓
Server verifies token on protected routes
```

---

## File Storage Strategy

### Old Approach (❌ Broken)
- Base64 encoding in database
- Large payload sizes
- Browser localStorage limits
- PayloadTooLarge errors

### New Approach (✅ Working)
- Files stored in Supabase Storage
- Only URLs in database
- No size limitations
- Fast CDN delivery
- Secure and scalable

---

## Deployment Architecture

```
GitHub Repository
        ↓
   Push to main
        ↓
GitHub Actions / Netlify / Vercel
        ↓
   Build Process
   • npm install
   • npm run build
        ↓
   Deploy
   • Frontend: Static files
   • Backend: Node.js server
        ↓
Production URLs
   • Frontend: https://your-domain.com
   • Backend: https://api.your-domain.com
        ↓
Connected to Supabase
   • Database (always live)
   • Storage (always accessible)
```

---

## Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Authentication
- **Multer** - File uploads

### Infrastructure
- **Supabase** - Database + Storage + Auth
- **GitHub** - Version control
- **Netlify/Vercel** - Hosting (optional)

---

**Last Updated**: October 7, 2026
