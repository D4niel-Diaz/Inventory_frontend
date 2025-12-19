# API Connection Test Checklist

## Pre-Testing Setup

### Backend Requirements
- [ ] Laravel backend is running on `http://localhost:8000`
- [ ] Database is migrated and seeded
- [ ] At least one admin user exists in database
- [ ] At least one regular user exists in database

### Frontend Requirements
- [ ] Frontend is running on `http://localhost:3000`
- [ ] `.env.local` file exists with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- [ ] Dependencies are installed (`npm install`)

## Authentication Tests

### Registration (Public)
- [ ] Navigate to `/register`
- [ ] Fill in registration form
- [ ] Submit form
- [ ] **Expected**: Redirect to dashboard, token stored in localStorage
- [ ] **Verify**: Check browser console for `auth_token` in localStorage

### Login - Regular User (Public)
- [ ] Navigate to `/login`
- [ ] Enter regular user credentials
- [ ] Submit form
- [ ] **Expected**: Redirect to dashboard, token stored
- [ ] **Verify**: Dashboard shows user-level features only

### Login - Admin User (Public)
- [ ] Navigate to `/login`
- [ ] Enter admin credentials (e.g., `admin@example.com` / `password`)
- [ ] Submit form
- [ ] **Expected**: Redirect to dashboard, token stored
- [ ] **Verify**: Dashboard shows admin features (Total Users card, etc.)

### Get User Data (Protected)
- [ ] After login, check if user data loads on dashboard
- [ ] **Expected**: User name appears in navbar
- [ ] **Verify**: User roles are properly loaded

### Logout (Protected)
- [ ] Click logout button
- [ ] **Expected**: Redirect to login, token removed from localStorage
- [ ] **Verify**: Cannot access protected routes

## User Routes Tests (Regular User)

### Categories
- [ ] Navigate to `/categories`
- [ ] **Expected**: List of all categories displayed
- [ ] Click on a category
- [ ] **Expected**: Category details shown

### Items
- [ ] Navigate to `/inventory`
- [ ] **Expected**: List of all items displayed
- [ ] Use search functionality
- [ ] **Expected**: Items filtered by search term
- [ ] Use category filter
- [ ] **Expected**: Items filtered by category
- [ ] Click "View" on an item
- [ ] **Expected**: Item details page with full information

### Transactions
- [ ] Navigate to `/transactions`
- [ ] **Expected**: List of user's transactions
- [ ] Filter by status (All, Borrowed, Returned)
- [ ] **Expected**: Transactions filtered correctly

### Borrow Item
- [ ] Navigate to an available item detail page
- [ ] Click "Borrow Item" button
- [ ] Fill in borrow form (dates)
- [ ] Submit form
- [ ] **Expected**: Success message, item quantity decreased
- [ ] **Verify**: Transaction appears in transactions list

### Return Item
- [ ] Navigate to `/transactions`
- [ ] Find a borrowed transaction
- [ ] Click "Return" button
- [ ] Confirm return
- [ ] **Expected**: Success message, transaction status changed to "returned"

### Notifications
- [ ] Click bell icon in navbar
- [ ] **Expected**: Notifications dropdown appears
- [ ] **Verify**: Unread count badge shows correct number
- [ ] Click on a notification
- [ ] **Expected**: Notification marked as read
- [ ] Click "Mark all as read"
- [ ] **Expected**: All notifications marked as read

### Profile Management
- [ ] Navigate to `/profile`
- [ ] Update name or email
- [ ] Submit profile form
- [ ] **Expected**: Success message, profile updated
- [ ] Upload profile image
- [ ] **Expected**: Image preview shown, image uploaded
- [ ] Switch to "Change Password" tab
- [ ] Fill in password change form
- [ ] Submit form
- [ ] **Expected**: Success message, password changed

## Admin Routes Tests (Admin User Only)

### Category Management
- [ ] Navigate to `/categories` as admin
- [ ] Click "Add New Category"
- [ ] Fill in category form
- [ ] Submit form
- [ ] **Expected**: Success message, category added to list
- [ ] Click "Edit" on a category
- [ ] Modify category details
- [ ] Submit form
- [ ] **Expected**: Success message, category updated
- [ ] Click "Delete" on a category (without items)
- [ ] Confirm deletion
- [ ] **Expected**: Success message, category removed
- [ ] Try to delete category with items
- [ ] **Expected**: Error message (cannot delete)

### Item Management
- [ ] Navigate to `/inventory` as admin
- [ ] Click "Add New Item"
- [ ] Fill in item form (name, description, category, quantity)
- [ ] Upload item image
- [ ] Submit form
- [ ] **Expected**: Success message, item added to list with image
- [ ] Click "Edit" on an item
- [ ] Modify item details
- [ ] Change item image
- [ ] Submit form
- [ ] **Expected**: Success message, item updated with new image
- [ ] Click "Delete" on an item (without active transactions)
- [ ] Confirm deletion
- [ ] **Expected**: Success message, item removed

### Transaction Management
- [ ] Navigate to `/transactions` as admin
- [ ] **Expected**: See all users' transactions
- [ ] **Verify**: User column shows transaction owners
- [ ] Click "Return" on a borrowed transaction
- [ ] **Expected**: Transaction marked as returned
- [ ] Click "Cancel" on a transaction
- [ ] **Expected**: Transaction cancelled

### User Management
- [ ] Navigate to `/users` as admin
- [ ] **Expected**: List of all users displayed
- [ ] **Verify**: User roles shown (Admin/User)
- [ ] **Verify**: User status shown (Active/Restricted)
- [ ] Click "Restrict" on a user
- [ ] **Expected**: User status changed to "Restricted"
- [ ] Click "Unrestrict" on a restricted user
- [ ] **Expected**: User status changed to "Active"
- [ ] **Verify**: Cannot restrict yourself (button disabled)

## Error Handling Tests

### Authentication Errors
- [ ] Try to access `/dashboard` without login
- [ ] **Expected**: Redirect to `/login`
- [ ] Try to access admin routes as regular user
- [ ] **Expected**: 403 error or redirect
- [ ] Login with wrong credentials
- [ ] **Expected**: Error message displayed

### Validation Errors
- [ ] Try to create item without required fields
- [ ] **Expected**: Validation error messages shown
- [ ] Try to upload file larger than 2MB
- [ ] **Expected**: Error message about file size
- [ ] Try to create category with duplicate name
- [ ] **Expected**: Validation error

### Network Errors
- [ ] Stop backend server
- [ ] Try to perform any API action
- [ ] **Expected**: Network error message
- [ ] **Verify**: User-friendly error displayed

## File Upload Tests

### Profile Image Upload
- [ ] Navigate to `/profile`
- [ ] Upload JPEG image
- [ ] **Expected**: Image preview shown, upload successful
- [ ] Upload PNG image
- [ ] **Expected**: Image preview shown, upload successful
- [ ] Try to upload non-image file
- [ ] **Expected**: Error or file rejected

### Item Image Upload
- [ ] Create/edit item as admin
- [ ] Upload item image
- [ ] **Expected**: Image preview shown
- [ ] Submit form
- [ ] **Expected**: Image saved and displayed on item page

## Performance Tests

### Dashboard Loading
- [ ] Navigate to `/dashboard`
- [ ] **Expected**: Loading indicator shown
- [ ] **Expected**: Data loads within 2-3 seconds
- [ ] **Verify**: All stats cards populated correctly

### Large Lists
- [ ] Navigate to `/inventory` with many items
- [ ] **Expected**: All items load and display
- [ ] Use search/filter
- [ ] **Expected**: Filtering works smoothly

## Browser Storage Tests

### Token Persistence
- [ ] Login successfully
- [ ] Refresh page
- [ ] **Expected**: Still logged in, no redirect
- [ ] Close browser tab and reopen
- [ ] **Expected**: Still logged in (token persists)

### Token Cleanup
- [ ] Logout
- [ ] Check localStorage
- [ ] **Expected**: `auth_token` removed
- [ ] Try to access protected route
- [ ] **Expected**: Redirect to login

## Cross-Browser Tests

Test the above scenarios in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

## API Response Verification

### Check Browser DevTools
For each API call, verify in Network tab:
- [ ] Request includes `Authorization: Bearer {token}` header
- [ ] Response status is correct (200, 201, 401, 403, etc.)
- [ ] Response format matches expected structure
- [ ] Error responses include helpful messages

## Common Issues and Solutions

### Issue: Login redirects back to login page
**Solution**: 
- Check if token is being stored in localStorage
- Verify backend is returning token in response
- Check browser console for errors

### Issue: 401 Unauthorized on all requests
**Solution**:
- Clear localStorage and login again
- Verify token is being sent in Authorization header
- Check backend token validation

### Issue: Admin features not showing
**Solution**:
- Verify user has 'admin' role in database
- Check `roles_array` in user data
- Verify `isAdmin` check in components

### Issue: File uploads failing
**Solution**:
- Check file size (max 2MB)
- Verify file type is allowed
- Check backend storage permissions
- Verify FormData is being sent correctly

### Issue: CORS errors
**Solution**:
- Verify backend CORS configuration
- Check `withCredentials: true` in API config
- Ensure frontend URL is in backend allowed origins

## Test Results Summary

Date: _______________
Tester: _______________

Total Tests: _______________
Passed: _______________
Failed: _______________
Skipped: _______________

### Failed Tests Details:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
_______________________________________________
_______________________________________________
_______________________________________________
