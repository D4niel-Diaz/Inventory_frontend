# Frontend-Backend Connection Setup Instructions

## Quick Fix for Network Error

If you're getting a "Network Error" when trying to login, follow these steps:

### 1. Create Environment File

Create a file named `.env.local` in the `inventory_frontend` directory with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Verify Backend is Running

Make sure your Laravel backend is running:

```bash
cd Inventory-Backend
php artisan serve
```

The backend should be running on `http://localhost:8000`

### 3. Restart Frontend Server

After creating `.env.local`, restart your Next.js development server:

```bash
cd inventory_frontend
npm run dev
```

### 4. Check Browser Console

Open your browser's developer console (F12) and check:
- The API URL should be logged: `API URL: http://localhost:8000/api`
- Any CORS errors should be visible
- Network tab should show the request details

### 5. Verify CORS Configuration

The backend CORS is configured to allow:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

If your frontend runs on a different port, update `Inventory-Backend/config/cors.php` to include your port.

## Troubleshooting

### Still Getting Network Error?

1. **Check Backend is Running**: Open `http://localhost:8000/api/login` in your browser (should show method not allowed, not connection refused)

2. **Check CORS Headers**: In browser DevTools → Network tab → Check the login request → Look for CORS headers in response

3. **Check API URL**: In browser console, verify the logged API URL matches your backend URL

4. **Firewall/Antivirus**: Sometimes Windows Firewall or antivirus blocks localhost connections

5. **Try Different Port**: If port 8000 is busy, change backend port:
   ```bash
   php artisan serve --port=8001
   ```
   Then update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001/api
   ```

## Files Modified

- ✅ `Inventory-Backend/config/cors.php` - Updated to allow localhost origins
- ✅ `Inventory-Backend/bootstrap/app.php` - Fixed CORS middleware configuration
- ✅ `inventory_frontend/src/lib/api.ts` - Added better error handling and debugging

