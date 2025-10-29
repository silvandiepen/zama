# Toast Store

Toast notification system for displaying temporary messages to users.

## Features

- Toast notifications with multiple variants
- Auto-dismiss functionality
- Manual dismiss options
- Stacking support
- Customizable positioning

## Usage

```typescript
import { useToast, ToastProvider } from '@/store/toast';

// Provider setup
function App() {
  return (
    <ToastProvider>
      <YourApp />
      <Toaster /> {/* Render toast container */}
    </ToastProvider>
  );
}

// Using the toast hook
function SaveButton() {
  const { addToast } = useToast();
  
  const handleSave = () => {
    addToast({
      title: 'Success!',
      message: 'Your changes have been saved.',
      variant: 'success',
    });
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

## API

### `useToast()`

Returns an object with:

- `toasts: ToastItem[]` - Array of current toasts
- `addToast: (toast: AddToastData) => string` - Add new toast, returns toast ID
- `removeToast: (id: string) => void` - Remove specific toast

### `ToastProvider`

Provider component that wraps your app to provide toast context.

### `<Toaster />`

Component that renders the toast container and displays all active toasts.

## Toast Variants

- `success` - Green toast for successful actions
- `warning` - Yellow/orange toast for warnings  
- `error` - Red toast for errors
- `info` - Blue toast for general information (default)

## Models

```typescript
interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  color?: string; // Custom color override
  closing?: boolean; // Internal state for animations
}

interface AddToastData {
  title: string;
  message?: string;
  variant?: ToastItem['variant'];
  color?: string;
}
```