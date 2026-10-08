# 🔧 Fix Supabase Storage RLS Issue

## Problem Identified ✅

The resume upload is failing with:
```
Error: new row violates row-level security policy
Status: 403 AccessDenied
```

**Root Cause**: Row Level Security (RLS) is enabled on the storage bucket, and the publishable API key doesn't have permission to upload files.

---

## Solution: Add Service Role Key (5 minutes)

### Step 1: Get Service Role Key from Supabase

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Login to your account

2. **Select your project**
   - Click on project: `wafakfhbskakncbcnmmg`

3. **Go to Project Settings**
   - Click the ⚙️ Settings icon at the bottom of the left sidebar
   - Or click "Project Settings" in the menu

4. **Navigate to API Settings**
   - Click on "API" in the settings menu
   - You'll see "Project API keys" section

5. **Copy the service_role key**
   - Find the key labeled: **`service_role`** (secret)
   - It starts with: `eyJ...`
   - Click the "Copy" button or reveal and copy manually
   - ⚠️ **IMPORTANT**: This is a secret key with full admin access!

### Step 2: Add Key to .env File

1. **Open `.env` file** in your project root

2. **Find this line**:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=
   ```

3. **Paste your service role key** after the `=`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZmFrZmhic2tha25jYmNubW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYyNzg0NTc4MCwiZXhwIjoxOTQzNDIxNzgwfQ.YOUR_ACTUAL_KEY_HERE
   ```

4. **Save the file**

### Step 3: Restart Server

1. **Stop the development server**
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Start it again**:
   ```bash
   npm run dev
   ```

3. **Server should restart successfully**

### Step 4: Test Resume Upload

1. Go to: http://localhost:5173/admin
2. Login with: `admin@vijay.dev` / `admin123`
3. Navigate to Profile section
4. Scroll to "Resume Files"
5. Click "Upload New Resume"
6. Select a PDF file
7. ✅ Should see: "Resume uploaded successfully!"

---

## Verify the Fix

Run the storage test script:

```bash
npx tsx scripts/test-supabase-storage.ts
```

**Expected output with service role key**:
```
✅ Testing with service role key...
✅ Upload with service role successful!
✅ File path: resumes/test-service-1234567890.pdf
✅ Test file cleaned up
```

---

## Alternative Solution: Configure RLS Policies (Advanced)

If you don't want to use the service role key, you can configure RLS policies in Supabase:

### Option A: Disable RLS on Storage Bucket (Quick but less secure)

1. Go to Supabase Dashboard → Storage → portfolio-files
2. Click on "Policies" tab
3. Disable RLS or create permissive policy

### Option B: Create Specific RLS Policies (Recommended for production)

1. Go to Supabase Dashboard → Storage → portfolio-files → Policies
2. Create INSERT policy:
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'portfolio-files' AND (storage.foldername(name))[1] = 'resumes');
   ```

3. Create SELECT policy:
   ```sql
   CREATE POLICY "Allow public downloads"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'portfolio-files');
   ```

4. Create DELETE policy:
   ```sql
   CREATE POLICY "Allow authenticated deletes"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (bucket_id = 'portfolio-files' AND (storage.foldername(name))[1] = 'resumes');
   ```

---

## Security Notes

### About Service Role Key

⚠️ **IMPORTANT SECURITY INFORMATION**:

- **What it is**: Admin key with full access to your Supabase project
- **What it can do**: Bypass ALL security policies (RLS, auth, etc.)
- **Where to use**: ONLY on backend server (Node.js)
- **Where NOT to use**: NEVER in frontend/client code
- **Why safe in your case**: 
  - It's in `.env` file
  - `.env` is in `.gitignore` (not committed to Git)
  - Only used on your backend server
  - Never exposed to browsers

### Best Practices

✅ **DO**:
- Keep service role key in `.env` file
- Use service role key only on backend
- Add `.env` to `.gitignore`
- Change service role key if accidentally exposed

❌ **DON'T**:
- Commit `.env` to Git
- Use service role key in frontend
- Share service role key publicly
- Hardcode key in source files

---

## Troubleshooting

### Still Getting 403 Error?

1. **Check .env file**:
   - Make sure key is on ONE line
   - No extra spaces
   - Key starts with `eyJ`

2. **Restart server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check server logs**:
   - Look for "📤 Starting upload..." messages
   - Check for any error details

4. **Verify key is loaded**:
   ```bash
   npx tsx scripts/test-supabase-storage.ts
   ```
   - Should show: "✅ Testing with service role key..."

### Getting Different Error?

1. **Check server terminal** for detailed error messages
2. **Check browser console** (F12) for frontend errors
3. **Run test script** to isolate the issue:
   ```bash
   npx tsx scripts/test-supabase-storage.ts
   ```

---

## What This Fixes

Once service role key is added:

- ✅ Resume uploads will work
- ✅ Files stored in Supabase Storage (portfolio-files bucket)
- ✅ Public URLs generated automatically
- ✅ Delete functionality works
- ✅ Multiple resume uploads work
- ✅ Set active resume works

---

## Summary

**Quick Fix** (5 minutes):
1. Get service role key from Supabase Dashboard → Settings → API
2. Add to `.env`: `SUPABASE_SERVICE_ROLE_KEY=your-key-here`
3. Restart server: `npm run dev`
4. Test resume upload ✅

**The service role key allows your backend to bypass RLS and upload files to Supabase Storage.**

---

**Need help?** Check the error messages in:
- Server terminal (where `npm run dev` is running)
- Browser console (F12 → Console tab)
- Run: `npx tsx scripts/test-supabase-storage.ts`

---

**Last Updated**: October 7, 2026
