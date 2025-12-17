# Back Button Component Usage

## Overview
The `BackButton` component provides a consistent way to navigate back in the application with proper functionality.

## Component Location
`src/components/ui/BackButton.tsx`

## Usage

### Basic Usage (Browser Back)
```tsx
import { BackButton } from '@/components/ui/BackButton';

<BackButton />
```
This will use the browser's back functionality (`router.back()`).

### With Custom Label
```tsx
<BackButton label="Back to Dashboard" />
```

### With Specific Route
```tsx
<BackButton href="/dashboard" label="Back to Dashboard" />
```

### With Custom Click Handler
```tsx
<BackButton 
  onClick={() => {
    // Custom logic
    router.push('/custom-route');
  }}
  label="Go Back"
/>
```

### In Profile Page
The profile page uses:
```tsx
<BackButton href="/dashboard" label="Back to Dashboard" className="mb-4" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | `undefined` | Optional route to navigate to |
| `label` | `string` | `"Back"` | Button label text |
| `className` | `string` | `""` | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | Custom click handler (overrides href/router.back) |

## Priority Order
1. If `onClick` is provided, it will be used
2. If `href` is provided, it will navigate to that route
3. Otherwise, it uses `router.back()` to go to the previous page

## Styling
- Uses `Button` component with `variant="secondary"` and `size="sm"`
- Includes an arrow icon (ArrowLeftIcon from Heroicons)
- Fully responsive and accessible

## Examples in Application

### Profile Page
Located at the top of the profile page, allows users to return to the dashboard.

### Future Usage
Can be added to any page that needs back navigation:
- Item detail pages
- Edit forms
- Settings pages
- Any nested view

## Best Practices
1. Always provide a meaningful label
2. Use `href` when you want to ensure navigation to a specific route
3. Use `onClick` for custom navigation logic
4. Place the button at the top of the page for better UX
5. Consider the user's context when choosing the back destination

