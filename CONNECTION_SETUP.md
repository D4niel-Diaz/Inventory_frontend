# Frontend to Backend Connection Setup

This document explains how the frontend is connected to the Laravel backend API.

## Configuration

### Environment Variables

Create a `.env.local` file in the `inventory_frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update this to your production API URL.

## API Connection

### Base Configuration

- **API Base URL**: Set via `NEXT_PUBLIC_API_URL` environment variable
- **Default**: `http://localhost:8000/api`
- **Authentication**: Bearer token (Laravel Sanctum)

### Authentication Flow

1. User registers/logs in → Token received from backend
2. Token stored in `localStorage`
3. Token automatically added to all API requests via axios interceptor
4. On 401 errors, user is redirected to login

### Backend Response Structure

All backend responses follow this structure:
```json
{
  "status": true,
  "message": "Success message",
  "data": { ... }
}
```

The frontend automatically handles this structure in:
- `AuthContext` - for authentication responses
- All page components - for data fetching

## API Endpoints Connected

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

### Categories
- `GET /api/user/categories` - List all categories (user)
- `GET /api/user/categories/{id}` - Get category details
- `POST /api/admin/categories` - Create category (admin)
- `PUT /api/admin/categories/{id}` - Update category (admin)
- `DELETE /api/admin/categories/{id}` - Delete category (admin)

### Items
- `GET /api/user/items` - List all items (user)
- `GET /api/user/items/{id}` - Get item details
- `POST /api/admin/items` - Create item (admin)
- `PUT /api/admin/items/{id}` - Update item (admin)
- `DELETE /api/admin/items/{id}` - Delete item (admin)

### Transactions
- `GET /api/user/transactions` - List user transactions
- `GET /api/admin/transactions` - List all transactions (admin)
- `POST /api/user/transactions/borrow` - Borrow an item
- `PUT /api/user/transactions/{id}/return` - Return an item
- `PUT /api/admin/transactions/{id}/cancel` - Cancel transaction (admin)

### Notifications
- `GET /api/user/notifications` - List notifications
- `GET /api/user/notifications/unread-count` - Get unread count
- `PUT /api/user/notifications/{id}/read` - Mark as read
- `PUT /api/user/notifications/mark-all-read` - Mark all as read

## Running the Application

1. **Backend**: 
   ```bash
   cd Inventory-Backend
   php artisan serve
   ```
   Backend runs on `http://localhost:8000`

2. **Frontend**:
   ```bash
   cd inventory_frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Make sure**:
   - Backend CORS is configured to allow requests from `http://localhost:3000`
   - Database is migrated and seeded
   - `.env` file in backend is properly configured

## Features Implemented

✅ User authentication (register/login/logout)
✅ Profile management
✅ Category management (admin only)
✅ Item management (admin only)
✅ Transaction management (borrow/return)
✅ Notifications
✅ Dashboard with statistics
✅ Role-based access control
✅ Error handling with toast notifications
✅ Loading states
✅ Responsive design

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure:
- Backend CORS config allows your frontend origin
- `config/cors.php` has `'allowed_origins' => ['http://localhost:3000']`

### Authentication Issues
- Check that token is being stored in localStorage
- Verify token format in Authorization header: `Bearer {token}`
- Ensure backend Sanctum is properly configured

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend is running on the specified port
- Check browser console for detailed error messages

