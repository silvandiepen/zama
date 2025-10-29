# Locale Store

Locale management store for handling internationalization and language preferences.

## Features

- Language switching
- Locale state persistence
- Translation support integration
- RTL/LTR layout support

## Usage

```typescript
import { useLocale, LocaleProvider } from '@/store/locale';

// Provider setup
function App() {
  return (
    <LocaleProvider>
      <YourApp />
    </LocaleProvider>
  );
}

// Using the locale hook
function LanguageSelector() {
  const { lang, setLang, availableLocales } = useLocale();
  
  // Your language switching logic here
}
```

## API

### `useLocale()`

Returns an object with:

- `lang: string` - Current language code (e.g., 'en', 'nl', 'fr')
- `setLang: (lang: string) => void` - Set current language
- `availableLocales: string[]` - List of available languages

### `LocaleProvider`

Provider component that wraps your app to provide locale context.

## Supported Languages

- English (`en`)
- Dutch (`nl`)
- French (`fr`)

## Models

```typescript
interface LocaleState {
  lang: string;
  availableLocales: string[];
}
```