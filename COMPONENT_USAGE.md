# Component Usage Guide

## Quick Reference

### Importing Components
```tsx
// Individual imports
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Or from index
import { Button, Card, Input, Modal } from '@/components/ui';
```

## Navbar Features

### Profile Button
The profile button is located in the **user menu dropdown** (top right):
- Click on your **avatar** (or initials) in the top right corner
- Select **"Your Profile"** from the dropdown menu
- This will navigate to `/profile`

### Login/Logout Buttons
- **When NOT authenticated**: 
  - "Login" button (secondary style) - links to `/login`
  - "Register" button (primary style) - links to `/register`
  - Located in the top right of the navbar

- **When authenticated**:
  - User avatar/initials in top right
  - Click to open dropdown menu
  - "Sign out" option in the dropdown (red/danger style)

### Navigation Links
- **Dashboard** - Main dashboard page
- **Inventory** - View all inventory items
- **Transactions** - View transaction history
- **Categories** (Admin only) - Manage categories
- **Users** (Admin only) - Manage users

## Complete Component Examples

### Button Examples
```tsx
// Primary button
<Button variant="primary" size="md">
  Save Changes
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>

// Button as link
<Button as="a" href="/dashboard" variant="primary">
  Go to Dashboard
</Button>

// Loading button
<Button isLoading={isSubmitting} variant="primary">
  Submit
</Button>
```

### Card Examples
```tsx
// Basic card
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Card with custom padding
<Card padding="lg">
  Large padding content
</Card>
```

### Input Examples
```tsx
// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password is required"
/>

// Input with helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>
```

### Modal Examples
```tsx
// Basic modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
</Modal>

// Modal with footer
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Item"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  }
>
  <form>
    <Input label="Name" />
  </form>
</Modal>
```

### Badge Examples
```tsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Inactive</Badge>
<Badge variant="info">New</Badge>
```

### Avatar Examples
```tsx
// Avatar with name
<Avatar name="John Doe" size="md" />

// Avatar with image
<Avatar 
  name="John Doe"
  imageUrl="/path/to/image.jpg"
  size="lg"
/>
```

### NavLink Examples
```tsx
// Navigation link
<NavLink href="/dashboard">
  Dashboard
</NavLink>

// Exact match
<NavLink href="/dashboard" exact>
  Dashboard
</NavLink>
```

## Color Usage

### Primary Actions
- Use `primary-600` (#4f46e5) for:
  - Main call-to-action buttons
  - Active navigation items
  - Primary links
  - Brand elements

### Success States
- Use `secondary-600` (#16a34a) for:
  - Success messages
  - Completed states
  - Positive confirmations

### Danger States
- Use `danger-600` (#dc2626) for:
  - Delete buttons
  - Error messages
  - Destructive actions
  - Logout button

### Warning States
- Use `warning-500` (#f59e0b) for:
  - Warning messages
  - Pending states
  - Caution indicators

## Best Practices

1. **Consistency**: Always use the UI components instead of custom styling
2. **Colors**: Stick to the defined color system
3. **Spacing**: Use consistent padding and margins
4. **Responsive**: All components are responsive by default
5. **Accessibility**: Components include proper ARIA labels and keyboard support
6. **Loading States**: Always show loading states for async operations
7. **Error Handling**: Use error props in Input components
8. **Icons**: Use Heroicons for consistency

## Common Patterns

### Form with Validation
```tsx
<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    type="email"
    error={errors.email?.message}
    {...register('email', { required: 'Email is required' })}
  />
  <Button type="submit" isLoading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Card with Actions
```tsx
<Card>
  <h3>Item Name</h3>
  <p>Description</p>
  <div className="mt-4 flex space-x-2">
    <Button variant="primary" size="sm">Edit</Button>
    <Button variant="danger" size="sm">Delete</Button>
  </div>
</Card>
```

### Status Display
```tsx
<div className="flex items-center space-x-2">
  <Badge variant={status === 'active' ? 'success' : 'danger'}>
    {status}
  </Badge>
  <span>Item Status</span>
</div>
```

