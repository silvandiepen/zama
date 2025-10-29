# Icon Component

A flexible icon component that renders SVG icons from the open-icon library with support for brand icons, multiple sizes, and colors.

## Features

- **Extensive Icon Library**: Access to 1000+ icons from open-icon library
- **Brand Icons**: Built-in support for common brand logos (GitHub, Google)
- **Multiple Sizes**: Small, medium, large, and extra-large variants
- **Color Support**: Integrates with the design system colors
- **Accessibility**: Proper ARIA labels and semantic markup
- **Icon Mapping**: Common icon names mapped to open-icon equivalents
- **Loading States**: Graceful handling while icons load
- **Fallback**: Graceful fallback for missing icons

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Icon name or brand identifier |
| `size` | `'small' \| 'medium' \| 'large' \| 'xl'` | `'medium'` | Icon size variant |
| `color` | `Color` | `undefined` | Icon color from design system |
| `className` | `string` | `undefined` | Additional CSS classes |
| `ariaLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Supported Icons

### Common Icons (Mapped Names)

The component provides convenient mappings for common icon names:

- **Navigation**: `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`
- **Actions**: `plus`, `minus`, `check`, `x`, `edit`, `search`, `download`
- **UI Elements**: `eye`, `eye-off`, `menu`, `close`, `settings`
- **Media**: `play`, `image`, `photo`, `play-circle`
- **User**: `user`, `users`, `mail`, `phone`, `lock`, `unlock`
- **Business**: `briefcase`, `award`, `trending-up`, `bar-chart`
- **Technology**: `code`, `database`, `key`, `shield`, `globe`

### Brand Icons

Built-in support for brand logos:

- `github` - GitHub logo
- `google` - Google logo

### Open-Icon Library

You can also use any icon name directly from the open-icon library by using the official icon name.

## Usage

### Basic Usage

```tsx
import { Icon } from '@/components/Icon';

function Example() {
  return (
    <div>
      <Icon name="chevron-down" />
      <Icon name="user" />
      <Icon name="settings" />
    </div>
  );
}
```

### Sizes

```tsx
function SizeExample() {
  return (
    <div>
      <Icon name="star" size="small" />
      <Icon name="star" size="medium" />
      <Icon name="star" size="large" />
      <Icon name="star" size="xl" />
    </div>
  );
}
```

### Colors

```tsx
function ColorExample() {
  return (
    <div>
      <Icon name="heart" color="red" />
      <Icon name="check" color="green" />
      <Icon name="alert" color="orange" />
    </div>
  );
}
```

### Accessibility

```tsx
function AccessibleExample() {
  return (
    <button>
      <Icon name="menu" ariaLabel="Open navigation menu" />
      Menu
    </button>
  );
}
```

### Brand Icons

```tsx
function BrandExample() {
  return (
    <div>
      <Icon name="github" />
      <Icon name="google" />
    </div>
  );
}
```

### Custom Classes

```tsx
function CustomExample() {
  return (
    <Icon 
      name="sparkles" 
      className="custom-icon-class"
      size="large"
    />
  );
}
```

## Icon Names Reference

### Commonly Used Icons

| Category | Icons |
|----------|-------|
| **Navigation** | `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `arrow-right` |
| **Actions** | `plus`, `minus`, `check`, `x`, `edit`, `trash`, `copy`, `download` |
| **Forms** | `eye`, `eye-off`, `search`, `lock`, `unlock`, `mail`, `phone` |
| **Media** | `play`, `image`, `photo`, `photograph`, `play-circle` |
| **UI** | `menu`, `close`, `settings`, `sun`, `moon`, `home`, `user`, `users` |
| **Status** | `check-circle`, `alert`, `information`, `info`, `activity` |
| **Business** | `briefcase`, `award`, `trending-up`, `bar-chart`, `dollar-sign` |
| **Files** | `folder`, `package`, `file-text`, `document-text`, `collection` |
| **Development** | `code`, `database`, `key`, `shield`, `globe`, `laptop` |
| **Social** | `heart`, `star`, `book`, `calendar`, `map-pin` |

## Styling

The icon uses BEM-style class names with the `icon` namespace:

- `.icon` - Base icon class
- `.icon--small`, `.icon--medium`, `.icon--large`, `.icon--xl` - Size modifiers
- `.icon--color-{color}` - Color modifiers (e.g., `.icon--color-red`)
- `.icon--is-brand` - Brand icon modifier

Custom styles can be applied by targeting these classes in your SCSS.

## Performance

- Icons are loaded asynchronously from the open-icon library
- Brand icons are embedded directly for better performance
- Loading states prevent layout shifts during icon loading
- Graceful fallback for missing or failed icon loads

## Dependencies

- `open-icon` - For the extensive icon library
- `@/utils/bemm` - For BEM class name generation
- `@/types` - For Color type integration

## Notes

- All icons are rendered as inline SVGs for optimal scaling
- The component handles icon loading states gracefully
- Missing icons will log warnings but won't break the UI
- Brand icons have priority over open-icon mappings
- Custom `ariaLabel` should be provided for icons that convey meaning