# API Connection Guide

## Overview
This guide explains how the frontend connects to the Laravel backend API and how to configure it properly.

## Backend API Configuration

### Base URL
The frontend connects to the backend API using the URL configured in environment variables:
- Default: `http://localhost:8000/api`
- Configure via: `NEXT_PUBLIC_API_URL` environment variable

### Authentication Method
The application uses **Laravel Sanctum with Bearer Token Authentication**:
1. User logs in with email/password
2. Backend returns a Bearer token
3. Token is stored in `localStorage` as `auth_token`
4. All subsequent API requests include the token in the `Authorization` header

## Setup Instructions

### 1. Backend Setup
Ensure your Laravel backend is running on `http://localhost:8000`:
```bash
cd Inventory-Full-Backend
php artisan serve
```

### 2. Frontend Configuration
Create a `.env.local` file in the frontend root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Frontend
```bash
cd FRONTEND-Inventory
npm install
npm run dev
```

## API Routes Connected

### Authentication Routes (Public)
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/health` - Health check

### Authentication Routes (Protected)
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user data
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password

### User Routes (Protected)
- `GET /api/user/categories` - List all categories
- `GET /api/user/categories/{id}` - Get category details
- `GET /api/user/items` - List all items (supports query params)
- `GET /api/user/items/{id}` - Get item details
- `GET /api/user/transactions` - List user transactions
- `POST /api/user/transactions/borrow` - Borrow an item
- `PUT /api/user/transactions/{id}/return` - Return an item
- `GET /api/user/notifications` - List notifications
- `GET /api/user/notifications/unread-count` - Get unread count
- `PUT /api/user/notifications/{id}/read` - Mark notification as read
- `PUT /api/user/notifications/mark-all-read` - Mark all as read

### Admin Routes (Protected - Admin Only)
- `GET /api/admin/categories` - List categories (admin view)
- `POST /api/admin/categories` - Create category
- `GET /api/admin/categories/{id}` - Get category (admin view)
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category
- `GET /api/admin/items` - List items (admin view)
- `POST /api/admin/items` - Create item (supports file upload)
- `GET /api/admin/items/{id}` - Get item (admin view)
- `PUT /api/admin/items/{id}` - Update item (supports file upload)
- `DELETE /api/admin/items/{id}` - Delete item
- `GET /api/admin/transactions` - List all transactions
- `PUT /api/admin/transactions/{id}/cancel` - Cancel transaction
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/toggle-restriction` - Toggle user restriction

## API Service Usage

### Example: Login
```typescript
import { authService } from '@/lib/api';

const handleLogin = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  // Token is automatically stored in localStorage
  // User data is available in response.data.data.user
};
```

### Example: Create Item (Admin)
```typescript
import { itemService } from '@/lib/api';

const handleCreateItem = async (formData: FormData) => {
  const response = await itemService.create(formData);
  // Response contains the created item
};
```

### Example: Borrow Item (User)
```typescript
import { transactionService } from '@/lib/api';

const handleBorrow = async (itemId: number, dueDate: string) => {
  const response = await transactionService.borrow({
    item_id: itemId,
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: dueDate
  });
};
```

## Response Format

All API responses follow this format:
```json
{
  "status": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "status": false,
  "message": "Error message",
  "errors": { /* validation errors if applicable */ }
}
```

## Authentication Flow

1. **Login**: User submits credentials → Backend validates → Returns token + user data
2. **Token Storage**: Frontend stores token in localStorage
3. **Authenticated Requests**: All API calls include `Authorization: Bearer {token}` header
4. **Token Validation**: Backend validates token on each request
5. **Logout**: Token is removed from localStorage and revoked on backend

## Role-Based Access

### User Role
- Can view items and categories
- Can borrow and return items
- Can view their own transactions
- Can manage their profile

### Admin Role
- All user permissions
- Can create, update, delete items
- Can create, update, delete categories
- Can view all transactions
- Can cancel transactions
- Can manage users (restrict/unrestrict)

## Troubleshooting

### Login redirects back to login page
**Solution**: This was caused by missing token storage. Now fixed - token is stored in localStorage after successful login.

### 401 Unauthorized errors
**Causes**:
1. Token not stored in localStorage
2. Token expired
3. User logged out

**Solution**: Clear localStorage and login again

### CORS errors
**Solution**: Ensure backend CORS is configured to allow requests from frontend origin:
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'supports_credentials' => true,
```

### 403 Forbidden on admin routes
**Cause**: User doesn't have admin role

**Solution**: Ensure user has 'admin' role assigned in database

## File Upload

For file uploads (profile images, item images), use FormData:
```typescript
const formData = new FormData();
formData.append('name', 'Item Name');
formData.append('image', fileObject);

await itemService.create(formData);
```

## Query Parameters

Some endpoints support query parameters for filtering:
```typescript
// Filter items by category
await itemService.getAll({ category_id: 1 });

// Filter items by status
await itemService.getAll({ status: 'available' });
```

## Best Practices

1. **Always check authentication status** before accessing protected routes
2. **Handle errors gracefully** with try-catch blocks
3. **Show loading states** during API calls
4. **Display user-friendly error messages** from API responses
5. **Clear sensitive data** on logout
6. **Validate data** on frontend before sending to API
7. **Use TypeScript types** for type safety

## Testing API Connection

To test if the API is connected properly:

1. Check health endpoint:
```bash
curl http://localhost:8000/api/health
```

2. Test login in browser console:
```javascript
fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
})
.then(r => r.json())
.then(console.log);
```

## Environment Variables

Create `.env.local` file (not tracked by git):
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=true
```

## Summary

All backend API routes are now properly connected to the frontend with:
- ✅ Bearer token authentication
- ✅ Automatic token management
- ✅ Role-based access control
- ✅ Comprehensive error handling
- ✅ File upload support
- ✅ Query parameter support
- ✅ CRUD operations for all resources
