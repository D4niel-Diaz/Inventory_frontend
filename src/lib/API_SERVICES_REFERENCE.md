# API Services Quick Reference

## Import Statement
```typescript
import { 
  authService, 
  categoryService, 
  itemService, 
  transactionService, 
  notificationService, 
  userService,
  healthService 
} from '@/lib/api';
```

## Auth Service

### Methods
```typescript
// CSRF Cookie (call before login/register)
authService.csrfCookie()

// Register new user
authService.register({ name, email, password, password_confirmation })

// Login user
authService.login({ email, password })

// Logout user
authService.logout()

// Get authenticated user
authService.getUser()

// Update profile (supports FormData for image upload)
authService.updateProfile(data)

// Change password
authService.changePassword({ current_password, password, password_confirmation })
```

## Category Service

### User Methods
```typescript
// Get all categories
categoryService.getAll()
categoryService.getUserCategories()

// Get category by ID
categoryService.getById(id)
```

### Admin Methods
```typescript
// Get all categories (admin view)
categoryService.getAdminCategories()

// Get category by ID (admin view)
categoryService.getAdminCategoryById(id)

// Create category
categoryService.create({ name, description })
categoryService.createCategory({ name, description })

// Update category
categoryService.update(id, { name, description })
categoryService.updateCategory(id, { name, description })

// Delete category
categoryService.delete(id)
categoryService.deleteCategory(id)
```

## Item Service

### User Methods
```typescript
// Get all items (with optional filters)
itemService.getAll({ category_id: 1, status: 'available' })
itemService.getUserItems({ category_id: 1 })

// Get item by ID
itemService.getById(id)
```

### Admin Methods
```typescript
// Get all items (admin view)
itemService.getAdminItems({ category_id: 1 })

// Get item by ID (admin view)
itemService.getAdminItemById(id)

// Create item (supports FormData for image upload)
const formData = new FormData();
formData.append('name', 'Item Name');
formData.append('description', 'Description');
formData.append('category_id', '1');
formData.append('quantity', '10');
formData.append('status', 'available');
formData.append('image', fileObject);
itemService.create(formData)
itemService.createItem(formData)

// Update item (supports FormData for image upload)
itemService.update(id, formData)

// Delete item
itemService.delete(id)
itemService.deleteItem(id)
```

## Transaction Service

### User Methods
```typescript
// Get all user transactions (with optional filters)
transactionService.getAll({ status: 'borrowed' })
transactionService.getUserTransactions()

// Borrow item
transactionService.borrow({
  item_id: 1,
  borrow_date: '2024-01-01',
  due_date: '2024-01-08'
})

// Return item
transactionService.returnItem(transactionId)
transactionService.returnTransaction(transactionId)
```

### Admin Methods
```typescript
// Get all transactions (admin view)
transactionService.getAllAdmin({ status: 'borrowed' })
transactionService.getAdminTransactions()

// Cancel transaction
transactionService.cancel(transactionId)
transactionService.cancelTransaction(transactionId)
```

## Notification Service

### Methods
```typescript
// Get all notifications
notificationService.getAll()
notificationService.getAllNotifications()

// Get unread count
notificationService.getUnreadCount()

// Mark notification as read
notificationService.markAsRead(notificationId)
notificationService.markNotificationAsRead(notificationId)

// Mark all notifications as read
notificationService.markAllAsRead()
notificationService.markAllNotificationsAsRead()
```

## User Service (Admin Only)

### Methods
```typescript
// Get all users
userService.getAllUsers()
userService.getUsers()

// Toggle user restriction
userService.toggleUserRestriction(userId)
userService.restrictUser(userId)
userService.unrestrictUser(userId)
```

## Health Service

### Methods
```typescript
// Check API health
healthService.check()
```

## Response Handling

### Success Response
```typescript
{
  status: true,
  message: "Operation successful",
  data: { /* response data */ }
}
```

### Error Response
```typescript
{
  status: false,
  message: "Error message",
  errors: { /* validation errors */ }
}
```

## Usage Examples

### Example 1: Login Flow
```typescript
import { authService } from '@/lib/api';
import { toast } from 'react-toastify';

const handleLogin = async (email: string, password: string) => {
  try {
    await authService.csrfCookie();
    const response = await authService.login({ email, password });
    
    if (response.data.status) {
      const { user, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      toast.success('Login successful');
      // Redirect to dashboard
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Login failed');
  }
};
```

### Example 2: Create Item with Image
```typescript
import { itemService } from '@/lib/api';
import { toast } from 'react-toastify';

const handleCreateItem = async (formData: {
  name: string;
  description: string;
  category_id: string;
  quantity: number;
  image: File | null;
}) => {
  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    data.append('quantity', formData.quantity.toString());
    
    if (formData.image) {
      data.append('image', formData.image);
    }
    
    const response = await itemService.create(data);
    toast.success(response.data.message || 'Item created successfully');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create item';
    toast.error(errorMessage);
    throw error;
  }
};
```

### Example 3: Fetch and Display Items
```typescript
import { itemService } from '@/lib/api';
import { useState, useEffect } from 'react';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemService.getUserItems();
        const itemsData = response.data.data || response.data || [];
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### Example 4: Borrow Item
```typescript
import { transactionService } from '@/lib/api';
import { toast } from 'react-toastify';

const handleBorrowItem = async (itemId: number) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const response = await transactionService.borrow({
      item_id: itemId,
      borrow_date: today,
      due_date: nextWeek.toISOString().split('T')[0]
    });
    
    toast.success(response.data.message || 'Item borrowed successfully');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to borrow item');
  }
};
```

### Example 5: Admin - Toggle User Restriction
```typescript
import { userService } from '@/lib/api';
import { toast } from 'react-toastify';

const handleToggleRestriction = async (userId: number, isRestricted: boolean) => {
  try {
    const response = await userService.toggleUserRestriction(userId);
    const message = isRestricted ? 'User unrestricted' : 'User restricted';
    toast.success(response.data.message || message);
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update user status');
  }
};
```

## Error Handling Best Practices

```typescript
try {
  const response = await someService.someMethod();
  
  // Check if response has expected structure
  if (response.data?.status) {
    const data = response.data.data || response.data;
    // Handle success
  }
} catch (error: any) {
  // Handle different error types
  if (error.response?.status === 422) {
    // Validation errors
    const errors = error.response.data.errors;
    const errorMessages = Object.values(errors).flat().join(', ');
    toast.error(errorMessages);
  } else if (error.response?.status === 401) {
    // Unauthorized
    toast.error('Please login to continue');
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Forbidden
    toast.error('You do not have permission to perform this action');
  } else if (error.code === 'ERR_NETWORK') {
    // Network error
    toast.error('Cannot connect to server. Please check your connection.');
  } else {
    // Generic error
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
  }
}
```

## TypeScript Types

```typescript
// User type
interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  roles?: any[];
  roles_array?: string[];
  is_restricted?: boolean;
}

// Item type
interface Item {
  id: number;
  name: string;
  description: string;
  category_id: number;
  quantity: number;
  status: 'available' | 'borrowed' | 'maintenance';
  image?: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

// Category type
interface Category {
  id: number;
  name: string;
  description?: string;
  items?: Item[];
  created_at: string;
  updated_at: string;
}

// Transaction type
interface Transaction {
  id: number;
  user_id: number;
  item_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'cancelled';
  user?: User;
  item?: Item;
  created_at: string;
  updated_at: string;
}

// Notification type
interface Notification {
  id: number;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
}
```

## Notes

- All methods return Axios promises
- Token is automatically included in all requests via interceptor
- FormData is automatically detected and Content-Type header is removed
- CSRF cookie should be called before login/register for Laravel Sanctum
- All admin methods require 'admin' role
- File uploads support: JPEG, PNG, JPG, GIF (max 2MB)
