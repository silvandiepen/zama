# Theme Store

Theme management store for handling application theme switching and preferences.

## Features

- Light/dark theme switching
- Theme persistence
- System theme detection
- CSS custom properties integration

## Usage

```typescript
import { useTheme, ThemeProvider } from '@/store/theme';

// Provider setup
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// Using the theme hook
function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  // Your theme switching logic here
}
```

## API

### `useTheme()`

Returns an object with:

- `theme: 'light' | 'dark'` - Current theme
- `toggleTheme: () => void` - Toggle between light and dark
- `setTheme: (theme: 'light' | 'dark') => void` - Set specific theme

### `ThemeProvider`

Provider component that wraps your app to provide theme context.

## Theme Integration

The store integrates with CSS custom properties for seamless theme switching:

```css
:root {
  --color-background: var(--theme-background);
  --color-text: var(--theme-text);
  /* ... more theme variables */
}

[data-theme="light"] {
  --theme-background: #ffffff;
  --theme-text: #000000;
}

[data-theme="dark"] {
  --theme-background: #000000;
  --theme-text: #ffffff;
}
```

## Models

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
}
```