# 🚀 Quick Start Guide - Resume Upload Fix

## Problem Summary
You were getting **400 Bad Request** errors when trying to update profile and upload resumes. This has been **FIXED**!

---

## ✅ What Was Fixed

1. **Profile Update Error** - Fixed validation and duplicate code issues
2. **Resume Upload Error** - Migrated from base64 (too large) to Supabase Storage
3. **Resume Management** - Added full resume management system with multiple uploads

---

## 🎯 One-Time Setup (5 minutes)

### Create Supabase Storage Bucket

**You MUST do this once before resume uploads will work:**

1. Go to: https://supabase.com/dashboard
2. Select project: `wafakfhbskakncbcnmmg`
3. Click "Storage" in left sidebar
4. Click "New Bucket"
5. Enter name: `portfolio-files`
6. Toggle "Public bucket" to **ON**
7. Click "Create"

✅ **That's it!** Resume uploads will now work.

---

## 🏃 Start Your Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Server will start on: http://localhost:5173

---

## 🔐 Login to Admin Panel

1. Go to: http://localhost:5173/admin
2. Login with:
   - Email: `admin@vijay.dev`
   - Password: `admin123`

---

## 📝 Update Your Profile

1. In admin dashboard, click "Profile" section
2. Fill in your details:
   - **Name** (required - don't leave empty!)
   - Email, phone, location
   - LinkedIn, GitHub URLs
   - Years of experience
   - Number of projects
   - Add your tagline roles (e.g., "Shopify Developer")
3. Click "Save Changes"

✅ Should see: "Profile updated successfully!"

---

## 📄 Upload Resume (After Creating Bucket)

### Option 1: From Profile Manager
1. In Profile section, scroll down to "Resume Files"
2. Click "Upload New Resume"
3. Select your PDF file (max 10MB)
4. Click "Set Active" to make it the active resume

### Option 2: From Resume Manager
1. Click "Resume" tab in admin dashboard (if available)
2. Click "Upload New Resume"
3. Select PDF file
4. Click "Set Active" for the resume you want to show

### Manage Resumes
- **View**: Opens resume in new tab
- **Set Active**: Makes this resume appear on your portfolio
- **Delete**: Removes resume from database and storage

---

## 🧪 Test Everything Works

```bash
# Test database connection
npx tsx scripts/test-supabase-connection.ts

# Test profile update
npx tsx scripts/test-profile-update.ts
```

---

## ⚠️ Common Issues

### "Failed to update profile"
- ✅ Make sure **Name** field is not empty
- ✅ Check server is running (npm run dev)
- ✅ Check browser console for errors (F12)

### Resume upload fails
- ✅ Did you create the `portfolio-files` bucket?
- ✅ Is the bucket set to "Public"?
- ✅ Is your file a PDF and under 10MB?

### Can't login
- ✅ Email: `admin@vijay.dev`
- ✅ Password: `admin123`
- ✅ Make sure server is running

---

## 📚 Detailed Documentation

- **Setup Guide**: `SUPABASE_STORAGE_SETUP.md`
- **All Fixes**: `FIXES_APPLIED.md`
- **Main README**: `README.md`

---

## 🎉 You're All Set!

Once you create the Supabase bucket, everything will work:
- ✅ Profile updates
- ✅ Resume uploads
- ✅ Multiple resume versions
- ✅ Set active resume
- ✅ Delete old resumes

**Happy coding!** 🚀
