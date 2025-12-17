# Design System Documentation

## Color System

### Primary Colors (Indigo)
- **Primary-50**: `#eef2ff` - Lightest background
- **Primary-100**: `#e0e7ff` - Light background
- **Primary-200**: `#c7d2fe` - Subtle background
- **Primary-300**: `#a5b4fc` - Hover states
- **Primary-400**: `#818cf8` - Secondary actions
- **Primary-500**: `#6366f1` - Base primary color
- **Primary-600**: `#4f46e5` - **Main buttons, links, active states**
- **Primary-700**: `#4338ca` - Hover states
- **Primary-800**: `#3730a3` - Darker variants
- **Primary-900**: `#312e81` - Darkest

### Secondary Colors (Green - Success)
- **Secondary-600**: `#16a34a` - Success buttons, badges
- **Secondary-700**: `#15803d` - Hover states
- Used for: Success messages, completed states, positive actions

### Danger Colors (Red)
- **Danger-600**: `#dc2626` - Danger buttons, delete actions
- **Danger-700**: `#b91c1c` - Hover states
- Used for: Delete buttons, error states, warnings

### Warning Colors (Amber/Yellow)
- **Warning-500**: `#f59e0b` - Warning badges
- Used for: Warnings, pending states, caution

### Info Colors (Blue)
- **Info-600**: `#2563eb` - Information badges
- Used for: Informational messages, neutral states

## Component Library

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Variants:**
- `primary` - Main actions (Indigo-600)
- `secondary` - Secondary actions (Gray)
- `danger` - Destructive actions (Red-600)
- `success` - Positive actions (Green-600)

**Sizes:**
- `sm` - Small buttons
- `md` - Medium buttons (default)
- `lg` - Large buttons

**Features:**
- Loading state with spinner
- Disabled state
- Active scale animation
- Shadow effects

### Card
```tsx
<Card padding="md">
  Content here
</Card>
```

**Padding Options:**
- `none` - No padding
- `sm` - Small padding (1rem)
- `md` - Medium padding (1.5rem) - default
- `lg` - Large padding (2rem)

### Input
```tsx
<Input 
  label="Email" 
  type="email"
  error={errors.email}
  helperText="Enter your email address"
/>
```

**Features:**
- Automatic label generation
- Error message display
- Helper text support
- Consistent styling

### Modal
```tsx
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
  footer={<Button>Close</Button>}
>
  Content
</Modal>
```

**Sizes:**
- `sm` - Small modal
- `md` - Medium modal (default)
- `lg` - Large modal
- `xl` - Extra large modal

### Badge
```tsx
<Badge variant="success" size="md">
  Active
</Badge>
```

**Variants:**
- `default` - Gray
- `success` - Green
- `warning` - Yellow
- `danger` - Red
- `info` - Blue

### Avatar
```tsx
<Avatar 
  name="John Doe"
  imageUrl="/path/to/image.jpg"
  size="md"
/>
```

**Sizes:**
- `sm` - 32px
- `md` - 40px (default)
- `lg` - 48px
- `xl` - 64px

**Features:**
- Automatic initials generation
- Image fallback
- Ring border for visibility

### NavLink
```tsx
<NavLink href="/dashboard">
  Dashboard
</NavLink>
```

**Features:**
- Automatic active state detection
- Consistent styling with navigation
- Hover effects

### Dropdown
```tsx
<Dropdown
  trigger={<Avatar name="User" />}
  items={[
    { label: 'Profile', href: '/profile', icon: <UserIcon /> },
    { label: 'Logout', onClick: handleLogout, variant: 'danger' }
  ]}
  align="right"
/>
```

### IconButton
```tsx
<IconButton
  icon={<PlusIcon />}
  variant="primary"
  size="md"
  tooltip="Add new item"
/>
```

## Navigation System

### Navbar Structure
- **Logo**: Left side with icon and text
- **Main Navigation**: Center (Dashboard, Inventory, Transactions)
- **Admin Navigation**: Center (Categories, Users) - Admin only
- **User Menu**: Right side with avatar dropdown
- **Auth Buttons**: Login/Register when not authenticated

### User Menu Items
1. **Your Profile** - Links to `/profile`
2. **Sign out** - Logout action (danger variant)

### Mobile Navigation
- Hamburger menu for mobile devices
- Collapsible menu with all navigation items
- User menu accessible via avatar

## Typography

### Headings
- **H1**: `text-3xl font-bold` - Page titles
- **H2**: `text-2xl font-semibold` - Section titles
- **H3**: `text-lg font-medium` - Subsection titles

### Body Text
- **Default**: `text-sm` or `text-base`
- **Muted**: `text-gray-500` or `text-gray-600`
- **Small**: `text-xs`

## Spacing System

### Padding
- **xs**: `p-1` (0.25rem)
- **sm**: `p-2` (0.5rem)
- **md**: `p-4` (1rem)
- **lg**: `p-6` (1.5rem)
- **xl**: `p-8` (2rem)

### Margins
- **xs**: `m-1` (0.25rem)
- **sm**: `m-2` (0.5rem)
- **md**: `m-4` (1rem)
- **lg**: `m-6` (1.5rem)
- **xl**: `m-8` (2rem)

## Shadows

- **sm**: `shadow-sm` - Subtle elevation
- **md**: `shadow` - Default elevation
- **lg**: `shadow-lg` - Prominent elevation
- **xl**: `shadow-xl` - Maximum elevation

## Border Radius

- **sm**: `rounded` (0.25rem)
- **md**: `rounded-md` (0.375rem) - Default
- **lg**: `rounded-lg` (0.5rem)
- **full**: `rounded-full` - Circles

## Transitions

All interactive elements use:
- `transition-all duration-200` - Smooth transitions
- `active:scale-95` - Button press effect
- `hover:shadow-md` - Hover elevation

## Responsive Breakpoints

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large desktops

## Usage Guidelines

### Buttons
- Use **primary** for main actions
- Use **secondary** for less important actions
- Use **danger** for destructive actions
- Always provide loading states for async actions

### Colors
- Use primary-600 for main brand elements
- Use semantic colors (success, danger, warning) appropriately
- Maintain sufficient contrast (WCAG AA minimum)

### Spacing
- Use consistent spacing throughout
- Group related elements together
- Use whitespace to create visual hierarchy

### Icons
- Use Heroicons for consistency
- Match icon size to text size
- Use outline icons for default state
- Use solid icons for active/selected state

## Accessibility

- All interactive elements are keyboard accessible
- Focus indicators are visible
- ARIA labels where needed
- Color contrast meets WCAG standards
- Screen reader friendly

