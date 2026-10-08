# 🧪 Test Resume Upload - Step by Step

## ✅ Setup Complete!

Your service role key has been added and the server has been restarted.

**Test Results:**
- ✅ Environment variable loaded: `SUPABASE_SERVICE_ROLE_KEY` 
- ✅ Storage test passed: Upload with service role successful!
- ✅ Server restarted and running on http://localhost:3001
- ✅ Frontend running on http://localhost:5173

---

## 📝 Now Test Resume Upload

### Step 1: Open Admin Panel
1. Go to: **http://localhost:5173/admin**
2. Login with:
   - Email: `admin@vijay.dev`
   - Password: `admin123`

### Step 2: Navigate to Profile Section
1. Click on **"Profile"** in the admin dashboard
2. Scroll down to **"Resume Files"** section

### Step 3: Upload a Resume
1. Click **"Upload New Resume (PDF, max 10MB)"** button
2. Select a PDF file from your computer
3. Wait for upload to complete

### Expected Result: ✅
```
✅ Resume uploaded successfully!
```

The resume should appear in the list with:
- File name
- File size
- Upload date
- "Set Active" button
- "View" button
- Delete button (trash icon)

---

## 🔍 What to Check

### In Browser (Admin Panel)
- ✅ Success message: "Resume uploaded successfully!"
- ✅ Resume appears in the list
- ✅ No error messages
- ✅ No console errors (press F12 to check)

### In Server Terminal
You should see logs like:
```
📥 Resume upload request received
📄 File details:
   - Original name: My_Resume.pdf
   - Size: 245678 bytes
   - MIME type: application/pdf
📤 Uploading to Supabase Storage...
📤 Starting upload...
   - Filename: My_Resume.pdf
   - Folder: resumes
   - File size: 245678 bytes
   - Bucket: portfolio-files
   - Full path: resumes/1791365069295-My_Resume.pdf
✅ File uploaded successfully: resumes/1791365069295-My_Resume.pdf
✅ Public URL generated: https://wafakfhbskakncbcnmmg.supabase.co/storage/v1/object/public/portfolio-files/resumes/1791365069295-My_Resume.pdf
💾 Saving to database...
✅ Saved to database
```

---

## 🎯 Test Additional Features

### Test Set Active Resume
1. Click **"Set Active"** on any resume
2. ✅ Should see "Active" badge on that resume
3. ✅ Success message: "Active resume updated!"

### Test View Resume
1. Click **"View"** button
2. ✅ Resume opens in new browser tab
3. ✅ PDF displays correctly

### Test Delete Resume
1. Click **delete button** (trash icon)
2. Confirm deletion
3. ✅ Success message: "Resume deleted successfully!"
4. ✅ Resume removed from list

### Test Multiple Resumes
1. Upload 2-3 different resume PDFs
2. ✅ All appear in the list
3. ✅ Can set any one as active
4. ✅ Only one shows "Active" badge

---

## ❌ If Something Goes Wrong

### Error: "Failed to upload resume"
**Check:**
1. Server terminal for detailed error
2. Browser console (F12)
3. File is actually a PDF
4. File is under 10MB
5. Service role key is correct in .env

### Error: Still getting "row-level security" error
**Solutions:**
1. Make sure you saved .env file
2. Restart server again
3. Check service role key has no extra spaces
4. Run test script again:
   ```bash
   npx tsx scripts/test-supabase-storage.ts
   ```

### Resume uploaded but can't view it
**Check:**
1. Click "View" button - opens in new tab
2. Check the public URL in server logs
3. Verify bucket is PUBLIC in Supabase

---

## 🎉 Success Criteria

Your resume upload is working when:
- ✅ Can upload PDF files without errors
- ✅ Resumes appear in the list
- ✅ Can set active resume
- ✅ Can view resumes (opens in browser)
- ✅ Can delete resumes
- ✅ Multiple resumes work correctly
- ✅ Active resume downloads from public portfolio page

---

## 📊 Current Status

**Environment:**
- ✅ Service role key added to .env
- ✅ Server restarted with new key
- ✅ Storage test passed
- ✅ Database connected
- ✅ Supabase bucket exists and is public

**Ready for testing!**

---

## 🚀 Next Steps After Testing

1. **Upload your actual resume(s)**
2. **Set one as active**
3. **Verify it appears on public portfolio page**
4. **Test on different devices/browsers**
5. **Ready to deploy!**

---

**Last Updated**: October 7, 2026  
**Status**: ✅ Ready for testing - service role key configured
