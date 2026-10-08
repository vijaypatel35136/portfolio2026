# ✅ Setup & Testing Checklist

## 📋 Pre-Flight Check

### 1. Environment Setup
- [x] Node.js installed
- [x] npm packages installed
- [x] `.env` file configured with Supabase credentials
- [x] Database connected to Supabase
- [x] All tables created

---

## 🗄️ Supabase Storage Setup (REQUIRED - Do This First!)

### Create Storage Bucket
- [ ] Go to https://supabase.com/dashboard
- [ ] Select project: `wafakfhbskakncbcnmmg`
- [ ] Click "Storage" in left sidebar
- [ ] Click "New Bucket" or "Create a new bucket"
- [ ] Enter bucket name: `portfolio-files` (exactly this name!)
- [ ] Toggle "Public bucket" to **ON** (important!)
- [ ] Click "Create bucket"
- [ ] ✅ Bucket created successfully

**⏱️ Estimated time: 1 minute**

---

## 🧪 Local Testing

### Start the Application
- [ ] Run `npm run dev` in terminal
- [ ] Server starts on port 3001
- [ ] Frontend opens on http://localhost:5173
- [ ] No errors in terminal

### Admin Login
- [ ] Go to http://localhost:5173/admin
- [ ] Enter email: `admin@vijay.dev`
- [ ] Enter password: `admin123`
- [ ] Click "Login"
- [ ] ✅ Successfully logged into admin dashboard

---

## 👤 Profile Management Testing

### Test Profile Update
- [ ] Navigate to "Profile" section in admin
- [ ] See existing profile data loaded
- [ ] Update name field (required - don't leave empty!)
- [ ] Update other fields (email, phone, location, etc.)
- [ ] Add/edit tagline roles
- [ ] Click "Save Changes"
- [ ] ✅ See success message: "Profile updated successfully!"
- [ ] No errors in browser console (F12)
- [ ] No errors in server terminal

### Verify Name Validation
- [ ] Try to clear the name field completely
- [ ] Click "Save Changes"
- [ ] ✅ Should see error: "Name is required"
- [ ] Form should not submit with empty name

---

## 📄 Resume Management Testing

### Upload First Resume
- [ ] Scroll to "Resume Files" section in Profile page
- [ ] Click "Upload New Resume" button
- [ ] Select a PDF file (must be PDF, max 10MB)
- [ ] Wait for upload
- [ ] ✅ See success message: "Resume uploaded successfully!"
- [ ] Resume appears in the list below
- [ ] Can see file name, size, and upload date

### Test Multiple Resumes
- [ ] Upload a second resume PDF
- [ ] ✅ Both resumes appear in list
- [ ] Upload a third resume (optional)
- [ ] All resumes show correctly

### Set Active Resume
- [ ] Click "Set Active" on one resume
- [ ] ✅ See "Active" badge on that resume
- [ ] Other resumes should not have "Active" badge
- [ ] Click "Set Active" on different resume
- [ ] ✅ Active badge moves to new resume

### View Resume
- [ ] Click "View" button on any resume
- [ ] ✅ Resume opens in new browser tab
- [ ] PDF displays correctly
- [ ] Can download if needed

### Delete Resume
- [ ] Click delete button (trash icon) on a resume
- [ ] Confirm deletion in popup
- [ ] ✅ See success message: "Resume deleted successfully!"
- [ ] Resume removed from list
- [ ] If it was active, active badge clears

---

## 🔍 Verification Tests

### Database Verification
- [ ] Run: `npx tsx scripts/test-supabase-connection.ts`
- [ ] ✅ Shows connection successful
- [ ] ✅ Lists all tables
- [ ] ✅ Shows row counts

### Profile Verification
- [ ] Run: `npx tsx scripts/test-profile-update.ts`
- [ ] ✅ Shows existing profile
- [ ] ✅ Updates profile successfully
- [ ] ✅ Shows resumes if any uploaded

---

## 🌐 Public View Testing

### Frontend Public Pages
- [ ] Go to http://localhost:5173 (homepage)
- [ ] ✅ Profile information displays
- [ ] ✅ Skills section shows
- [ ] ✅ Experience section shows
- [ ] ✅ Projects section shows
- [ ] ✅ Active resume download link works (if resume uploaded)

### Resume Download
- [ ] Find resume/CV download button on homepage
- [ ] Click download/view button
- [ ] ✅ Active resume opens/downloads
- [ ] Correct PDF file opens

---

## 🐛 Error Testing

### Test File Upload Limits
- [ ] Try to upload non-PDF file (should fail)
- [ ] ✅ See error: "Only PDF files are allowed"
- [ ] Try to upload file > 10MB (should fail)
- [ ] ✅ See error: "File size must be less than 10MB"

### Test Profile Validation
- [ ] Clear name field in profile form
- [ ] Try to save
- [ ] ✅ See error: "Name is required"
- [ ] Fill name field
- [ ] Save successfully

---

## 🔒 Security Testing

### Authentication
- [ ] Try to access http://localhost:5173/admin without login
- [ ] ✅ Redirected to login page
- [ ] Login with correct credentials
- [ ] ✅ Can access admin dashboard
- [ ] Logout
- [ ] ✅ Redirected back to login

### API Protection
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Make an admin action (update profile)
- [ ] Check request headers
- [ ] ✅ See `Authorization: Bearer <token>` header

---

## 📱 Browser Testing (Optional)

### Different Browsers
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] ✅ All features work in all browsers

### Mobile Responsive
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test navigation
- [ ] Test forms
- [ ] ✅ Responsive design works

---

## 🚀 Pre-Deployment Checklist

### Code Quality
- [ ] No TypeScript errors: `npm run build`
- [ ] ✅ Build completes successfully
- [ ] No console errors in browser
- [ ] No warnings in terminal

### Environment Variables
- [ ] Review `.env` file
- [ ] All required variables set
- [ ] No placeholder values
- [ ] Secrets are secure

### Security
- [ ] Change admin password from default
- [ ] Use strong JWT secret
- [ ] Review all public endpoints
- [ ] Test authentication on all admin routes

### Documentation
- [ ] Read `QUICK_START.md`
- [ ] Read `FIXES_APPLIED.md`
- [ ] Read `SUPABASE_STORAGE_SETUP.md`
- [ ] Understand architecture

---

## ✅ Final Verification

### Everything Works?
- [ ] Profile updates work
- [ ] Resume uploads work
- [ ] Multiple resumes work
- [ ] Set active resume works
- [ ] Delete resume works
- [ ] Public pages display correctly
- [ ] Authentication works
- [ ] No errors anywhere

### Ready to Deploy?
- [ ] All tests passed
- [ ] Supabase bucket created
- [ ] Database connected
- [ ] All features tested
- [ ] Documentation reviewed
- [ ] Credentials secured

---

## 📊 Success Criteria

You've successfully completed setup when:
- ✅ Can login to admin panel
- ✅ Can update profile without errors
- ✅ Can upload PDF resumes
- ✅ Can set active resume
- ✅ Can delete resumes
- ✅ Active resume shows on public page
- ✅ All test scripts run successfully
- ✅ No errors in console or terminal

---

## 🎉 Congratulations!

If all checkboxes above are checked, your portfolio is:
- ✅ Fully functional
- ✅ Database connected
- ✅ Resume management working
- ✅ Ready for deployment

**Next Steps:**
1. Add your actual content (profile, skills, projects)
2. Upload your real resume(s)
3. Customize styling if needed
4. Deploy to production

---

## 📞 Need Help?

**Documentation Files:**
- `QUICK_START.md` - Quick setup guide
- `FIXES_APPLIED.md` - What was fixed
- `ARCHITECTURE.md` - System architecture
- `SUPABASE_STORAGE_SETUP.md` - Bucket setup
- `STATUS_SUMMARY.md` - Current status

**Common Issues:**
- Resume upload fails → Check bucket exists and is public
- Profile update fails → Check name field is not empty
- Can't login → Check credentials: admin@vijay.dev / admin123

---

**Last Updated**: October 7, 2026  
**Status**: Ready for testing after Supabase bucket creation
