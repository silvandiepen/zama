# Modal Component

A versatile modal dialog component with accessibility features, keyboard shortcuts, and customizable content.

## Features

- **Keyboard Navigation**: ESC key to close (configurable via feature flags)
- **Backdrop Interaction**: Click outside to close (configurable via feature flags)
- **Accessibility**: Proper ARIA attributes and semantic markup
- **Customizable**: Optional title, footer, and custom content
- **Responsive**: Adapts to different screen sizes
- **Feature Flag Integration**: Behavior controlled by feature flags

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the modal is open |
| `title` | `string` | `undefined` | Optional modal title displayed in header |
| `onClose` | `() => void` | Required | Function called when modal should close |
| `children` | `ReactNode` | Required | Modal content |
| `footer` | `ReactNode` | `undefined` | Optional footer content |

### Feature Flags

The modal component respects these feature flags:

- `enableKeyboardShortcuts`: Enables ESC key to close modal
- `enableClickOutsideToClose`: Enables clicking backdrop to close modal

## Usage

### Basic Modal

```tsx
import { Modal } from '@/components/Modal';
import { useState } from 'react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
      >
        <p>This is modal content.</p>
      </Modal>
    </div>
  );
}
```

### Modal with Footer

```tsx
import { Modal, Button } from '@/components/Modal';

function ConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);

  const footer = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => {
        // Handle confirm action
        setIsOpen(false);
      }}>
        Confirm
      </Button>
    </div>
  );

  return (
    <Modal 
      open={isOpen} 
      onClose={() => setIsOpen(false)}
      title="Confirm Action"
      footer={footer}
    >
      <p>Are you sure you want to proceed?</p>
    </Modal>
  );
}
```

### Custom Content Modal

```tsx
import { Modal } from '@/components/Modal';

function FormModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal 
      open={isOpen} 
      onClose={() => setIsOpen(false)}
      title="User Profile"
    >
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" />
        </div>
      </form>
    </Modal>
  );
}
```

## Styling

The modal uses BEM-style class names with the `modal` namespace:

- `.modal__overlay` - Backdrop overlay
- `.modal__window` - Modal container
- `.modal__header` - Header section
- `.modal__title` - Title text
- `.modal__close` - Close button
- `.modal__body` - Main content area
- `.modal__footer` - Footer section

Custom styles can be applied by targeting these classes in your SCSS.

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"` attributes
- Focus management is handled automatically
- Keyboard navigation support (ESC to close when enabled)
- Screen reader compatible with proper semantic markup

## Dependencies

- `@/utils/bemm` - For BEM class name generation
- `@/components/Button` - For the close button
- `@/store/featureFlags` - For feature flag integration
- `open-icon` - For close button icon