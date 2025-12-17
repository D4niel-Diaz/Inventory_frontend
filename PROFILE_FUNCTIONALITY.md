# Profile Page Functionality

## Overview
The profile page provides complete user profile management functionality with a back button for easy navigation.

## Features

### 1. Back Button
- **Location**: Top of the profile page
- **Label**: "Back to Dashboard"
- **Destination**: `/dashboard`
- **Component**: `BackButton` from `@/components/ui/BackButton`
- **Styling**: Text variant with hover effects and icon animation

### 2. Profile Information Tab

#### Update Profile
- **Name Field**: 
  - Required validation
  - Text input with error handling
  - Placeholder: "Enter your full name"

- **Email Field**:
  - Required validation
  - Email format validation
  - Unique email check (handled by backend)
  - Placeholder: "Enter your email address"

- **Profile Picture**:
  - Avatar display with user's current image or initials
  - Click camera icon to upload new image
  - Image preview before upload
  - Supported formats: JPEG, PNG, JPG, GIF
  - Max file size: 2MB
  - Image is resized to 300x300px on backend

#### Save Changes
- Button with loading state
- FormData submission for image uploads
- Success/error toast notifications
- User data refresh after successful update

### 3. Change Password Tab

#### Password Fields
- **Current Password**:
  - Required validation
  - Verified against database

- **New Password**:
  - Required validation
  - Minimum 8 characters
  - Helper text displayed

- **Confirm Password**:
  - Required validation
  - Must match new password
  - Real-time validation

#### Change Password
- Button with loading state
- Password validation on frontend and backend
- Success/error toast notifications
- Form reset after successful change

## Backend Integration

### API Endpoints

#### Update Profile
- **Endpoint**: `PUT /api/user/profile`
- **Method**: `updateProfile` in `AuthContext`
- **Request**: FormData (supports image upload)
- **Response**: 
  ```json
  {
    "status": true,
    "message": "Profile updated successfully",
    "data": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "profile_image": "users/filename.jpg",
      "roles_array": ["user"]
    }
  }
  ```

#### Change Password
- **Endpoint**: `PUT /api/user/password`
- **Method**: `changePassword` in `AuthContext`
- **Request**: 
  ```json
  {
    "current_password": "oldpassword",
    "password": "newpassword",
    "password_confirmation": "newpassword"
  }
  ```
- **Response**:
  ```json
  {
    "status": true,
    "message": "Password changed successfully"
  }
  ```

## User Experience

### Loading States
- Profile loading: Shows spinner while fetching user data
- Form submission: Button shows loading spinner
- Prevents multiple submissions

### Error Handling
- Field-level validation errors
- Backend validation errors displayed as toasts
- Network errors handled gracefully
- User-friendly error messages

### Success Feedback
- Toast notifications for successful operations
- User data automatically refreshed
- Profile image preview updates immediately

### Navigation
- Back button returns to dashboard
- Maintains user context
- Smooth transitions

## Component Structure

```
Profile Page
├── BackButton (Navigation)
├── Header (Title & Description)
├── Tabs
│   ├── Profile Information Tab
│   │   ├── Card
│   │   │   ├── Name Input
│   │   │   ├── Email Input
│   │   │   └── Profile Picture Upload
│   │   └── Save Button
│   └── Change Password Tab
│       ├── Card
│       │   ├── Current Password Input
│       │   ├── New Password Input
│       │   └── Confirm Password Input
│       └── Change Password Button
```

## Validation Rules

### Profile Information
- **Name**: Required, string
- **Email**: Required, valid email format, unique
- **Profile Image**: Optional, image file (jpeg, png, jpg, gif), max 2MB

### Password Change
- **Current Password**: Required, must match database
- **New Password**: Required, minimum 8 characters
- **Confirm Password**: Required, must match new password

## Security Features

1. **Authentication**: All endpoints require valid auth token
2. **Password Verification**: Current password verified before change
3. **Image Validation**: File type and size validation
4. **CSRF Protection**: Laravel Sanctum handles CSRF
5. **Input Sanitization**: Backend validates and sanitizes all inputs

## Testing Checklist

- [x] Back button navigates to dashboard
- [x] Profile information loads correctly
- [x] Name update works
- [x] Email update works
- [x] Profile image upload works
- [x] Profile image preview works
- [x] Password change works
- [x] Validation errors display correctly
- [x] Success messages display
- [x] Loading states work
- [x] Error handling works
- [x] User data refreshes after update
- [x] Roles are preserved after update

## Future Enhancements

1. Profile image cropping
2. Two-factor authentication
3. Email verification
4. Account deletion
5. Activity log
6. Notification preferences

