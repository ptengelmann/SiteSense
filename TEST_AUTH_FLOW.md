# Authentication Flow Testing Guide

## Prerequisites
- Development server running on `http://localhost:3002`
- Database connected and migrated
- Clean browser (no cached sessions)

## Test Cases

### 1. Homepage Access (Public Route)
- [ ] Visit `http://localhost:3002`
- [ ] Verify homepage loads with navigation and hero section
- [ ] Check "Get Started" and "Sign In" buttons are visible

### 2. Protected Route Redirect (Unauthenticated)
- [ ] Try to visit `http://localhost:3002/dashboard`
- [ ] Should automatically redirect to `/login`
- [ ] Verify login page displays correctly

### 3. User Registration Flow
- [ ] Visit `http://localhost:3002/register`
- [ ] Fill in the registration form:
  - First Name: John
  - Last Name: Smith
  - Company Name: Smith Construction Ltd
  - Email: john@smithconstruction.co.uk
  - Phone: 07123 456789 (optional)
  - Password: TestPassword123
  - Confirm Password: TestPassword123
- [ ] Click "Create account"
- [ ] Should redirect to `/login?registered=true`
- [ ] Verify success message or indicator

### 4. Login Flow
- [ ] On login page, enter credentials:
  - Email: john@smithconstruction.co.uk
  - Password: TestPassword123
- [ ] Click "Sign in"
- [ ] Should redirect to `/dashboard`
- [ ] Verify dashboard loads with:
  - Top navigation bar with company name
  - Sidebar with navigation links
  - Welcome message with user's first name
  - Stats cards (showing zeros initially)
  - Quick action buttons
  - Trial badge in sidebar

### 5. Authenticated Route Access
- [ ] While logged in, try visiting `/login`
- [ ] Should redirect back to `/dashboard`
- [ ] Try visiting `/register`
- [ ] Should redirect back to `/dashboard`

### 6. Session Persistence
- [ ] Refresh the page
- [ ] Should remain logged in
- [ ] Dashboard should load without redirect

### 7. Logout Flow
- [ ] Click "Sign out" button in top navigation
- [ ] Should redirect to `/login`
- [ ] Try to access `/dashboard`
- [ ] Should redirect to `/login` (unauthenticated)

### 8. Invalid Login Attempts
- [ ] Try logging in with incorrect password
- [ ] Should show error: "Invalid email or password"
- [ ] Try logging in with non-existent email
- [ ] Should show error: "Invalid email or password"

### 9. Registration Validation
- [ ] Try registering with passwords that don't match
- [ ] Should show error: "Passwords do not match"
- [ ] Try registering with password less than 8 characters
- [ ] Should show error: "Password must be at least 8 characters"
- [ ] Try registering with duplicate email
- [ ] Should show error: "A user with this email already exists"

## Manual Testing Steps

1. Open browser in incognito/private mode
2. Navigate to `http://localhost:3002`
3. Follow test cases 1-9 in order
4. Mark each checkbox as you complete the test
5. Document any issues found

## Expected Database State After Registration

### User Record
```sql
SELECT id, email, "firstName", "lastName", role, "companyId", "emailVerified", "isActive"
FROM "User"
WHERE email = 'john@smithconstruction.co.uk';
```

Expected:
- role: ADMIN (first user is always admin)
- emailVerified: false
- isActive: true
- companyId: (should match company record)

### Company Record
```sql
SELECT id, name, "subscriptionTier", "subscriptionStatus", "trialEndsAt"
FROM "Company"
WHERE name = 'Smith Construction Ltd';
```

Expected:
- subscriptionTier: STARTER
- subscriptionStatus: TRIAL
- trialEndsAt: (14 days from registration)

## Common Issues & Fixes

### Issue: JWT Error "no matching decryption secret"
**Fix**: Clear browser cookies or regenerate NEXTAUTH_SECRET

### Issue: Port 3002 not responding
**Fix**: Check if dev server is running with `pnpm dev -p 3002`

### Issue: Database connection error
**Fix**: Verify DATABASE_URL in .env.local is correct

### Issue: Session not persisting
**Fix**: Ensure NEXTAUTH_URL matches your development URL

## Automation Testing (Future)
- [ ] Set up Playwright/Cypress for E2E tests
- [ ] Add unit tests for auth utilities
- [ ] Add integration tests for API routes
