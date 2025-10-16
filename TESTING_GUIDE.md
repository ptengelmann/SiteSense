# Testing Guide - Phase 1 Features

## Quick Start (5 minutes)

### 1. Get Resend API Key (Required for Email Features)

**Option A: Quick Testing (Use Resend's Test Email)**
1. Go to https://resend.com
2. Sign up with your email
3. Go to API Keys: https://resend.com/api-keys
4. Create new API key, copy it
5. Add to `.env.local`:
   ```
   RESEND_API_KEY="re_your_key_here"
   ```
6. In `src/lib/email/resend.ts`, change the FROM_EMAIL to:
   ```typescript
   export const FROM_EMAIL = 'SiteSense <onboarding@resend.dev>';
   ```
   (This is Resend's test domain - works immediately!)

**Option B: Production Setup (Your Own Domain)**
1. Same steps as above
2. Verify your domain in Resend dashboard
3. Update FROM_EMAIL to use your domain: `onboarding@sitesense.co.uk`

### 2. Restart Dev Server

```bash
# Kill current server
pkill -f "next dev"

# Restart
pnpm dev
```

Or just press Ctrl+C in your terminal and run `pnpm dev` again.

---

## Testing Checklist

### ✅ Registration & Email Verification

**Test 1: Complete Registration Flow**

1. Go to: http://localhost:3000/register
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Company Name: Test Construction Ltd
   - Email: **your-real-email@gmail.com** (you need to receive the email!)
   - Phone: 07123456789 (optional)
   - Password: testpassword123
   - Confirm Password: testpassword123
3. Click "Create account"
4. You should see: "Account created successfully! Please check your email..."
5. Check your email inbox
6. Click the verification link
7. You should see "Email Verified!" page
8. Auto-redirect to login (or click "Go to Login")

**Expected Results:**
- ✅ Welcome email received within 1-2 minutes
- ✅ Email has nice HTML formatting
- ✅ Verification link works
- ✅ After verification, can log in successfully

**Test 2: Try Duplicate Email**

1. Go to registration again
2. Use the same email
3. Should see: "A user with this email already exists"

**Test 3: Password Validation**

1. Try password less than 8 characters
2. Should see: "Password must be at least 8 characters"
3. Try mismatched passwords
4. Should see: "Passwords do not match"

---

### ✅ Login & Onboarding

**Test 4: Login with Verified Account**

1. Go to: http://localhost:3000/login
2. Enter your email and password
3. Click "Sign in"
4. Should redirect to: http://localhost:3000/dashboard

**Test 5: Onboarding Flow**

1. After first login, manually go to: http://localhost:3000/onboarding
2. **Step 1: Welcome**
   - Should see personalized greeting with your first name
   - Shows 14-day trial message
   - Click "Let's Get Started"
3. **Step 2: Company Profile**
   - Fill in address: "123 Test Street"
   - City: "London"
   - Postcode: "SW1A 1AA"
   - Phone: "020 1234 5678"
   - Click "Continue" (or skip)
4. **Step 3: Add Subcontractor**
   - Read the guidance
   - Can click "Add Subcontractor Now" or "I'll do this later"
5. **Step 4: Dashboard Tour**
   - Review the 4 key features
   - See trial reminder
   - Click "Go to Dashboard"

**Expected Results:**
- ✅ Smooth flow between steps
- ✅ Can skip any step
- ✅ Back button works
- ✅ Ends at dashboard

---

### ✅ Landing Page Updates

**Test 6: Honest Feature Marketing**

1. Go to: http://localhost:3000
2. Scroll to "Features" section
3. Check:
   - ✅ "AI Invoice Validation" - NO badge (available now)
   - ✅ "Invoice OCR" - NO badge (available now)
   - ✅ "Payment Tracking" - NO badge (available now)
   - ✅ "Compliance Tracking" - NO badge (available now)
   - ✅ "HMRC CIS Integration" - **"Coming Q1 2026" badge** (honest!)
   - ✅ "Xero & QuickBooks" - **"Coming Q1 2026" badge** (honest!)

---

### ✅ Dashboard (Existing Features)

**Test 7: Dashboard Loads**

1. After login: http://localhost:3000/dashboard
2. Should see:
   - Welcome message with your name
   - Financial metrics (all zeros for new account)
   - Quick actions sidebar
   - Quick stats

**Test 8: Create a Subcontractor**

1. Click "Add Subcontractor" in quick actions
2. Fill in minimal required fields:
   - Company Name: "ABC Electrical Ltd"
   - Legal Entity: "Limited Company"
   - Contact Name: "John Smith"
   - Email: "john@abcelectrical.com"
   - Phone: "07987654321"
   - UTR: "1234567890"
3. Save
4. Should appear in subcontractors list

---

## Troubleshooting

### Email Not Received?

**Check 1: Resend API Key**
```bash
# In .env.local, make sure you have:
RESEND_API_KEY="re_your_actual_key"
```

**Check 2: Check Server Logs**
```bash
# Look for:
"Welcome email sent successfully: <message-id>"
# Or error:
"Failed to send welcome email: <error>"
```

**Check 3: Spam Folder**
- Check your spam/junk folder
- Resend emails can sometimes land there on first send

**Check 4: Resend Dashboard**
1. Go to https://resend.com/emails
2. Check recent emails
3. See delivery status

### Database Connection Issues?

```bash
# Test connection
nc -zv caboose.proxy.rlwy.net 55039

# Should see: "Connection succeeded!"

# If it fails, Railway might be sleeping. Try:
npx prisma db push
# This will wake it up
```

### Port Already in Use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
pnpm dev
```

---

## What to Test After Resend Setup

Once you have `RESEND_API_KEY` set:

1. ✅ **Welcome Email on Registration**
   - Should arrive within 1-2 minutes
   - HTML formatted nicely
   - Verification link works

2. ✅ **Resend Verification Email**
   - Try API endpoint: `POST /api/auth/resend-verification`
   - Body: `{"email": "your-email@example.com"}`
   - Should send new verification email

3. ✅ **Email Templates Look Good**
   - Check HTML rendering in email client
   - Test on mobile and desktop
   - Verify all links work

---

## Next Features to Build (Phase 2)

After email verification works:

1. **Email Notifications**
   - Invoice submitted → notify finance team
   - CIS expiring in 7 days → notify admin
   - Payment run ready → notify finance

2. **CSV Export Integration**
   - Add "Export to CSV" buttons on:
     - Subcontractors list
     - Invoices list
     - Payment runs list
   - Use functions from `src/lib/csv-export.ts`

3. **Login Enhancements**
   - Add "Resend verification email" link on login page
   - Show "Email not verified" warning

4. **Dashboard Enhancements**
   - Show "Complete onboarding" prompt if user skipped
   - Add email notification preferences

---

## Performance Testing

### Expected Load Times
- Landing page: < 1 second
- Dashboard (no data): < 2 seconds
- Registration: < 500ms
- Email delivery: 1-3 minutes (Resend)

### AI Invoice OCR
- Small invoice (< 1MB): 5-10 seconds
- Large invoice (> 5MB): 15-30 seconds
- Uses Claude Haiku for speed, Sonnet for accuracy

---

## Success Criteria

**Before Beta Launch:**
- ✅ Can register new account
- ✅ Receive and verify email
- ✅ Complete onboarding
- ✅ Add subcontractor
- ✅ Upload test invoice (with AI validation)
- ✅ Create payment run
- ✅ Export CSV

**Beta Launch Metrics:**
- 5 pilot customers signed up
- 80% complete onboarding
- 100% receive verification emails
- < 5% support tickets on registration
- Average time to first invoice: < 24 hours

---

## Support

- **Email Issues**: Check Resend dashboard logs
- **Database Issues**: Verify Railway connection
- **App Crashes**: Check browser console and server logs
- **Questions**: See VALUE_PROPOSITION_AND_WORKFLOW.md

Happy testing! 🚀
