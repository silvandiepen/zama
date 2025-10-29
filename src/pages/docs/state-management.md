# State Management Architecture

## Context API Pattern

We use React Context API for global state management with custom hooks:

```
// Context provider
const AuthContext = createContext<AuthContextType>();

// Custom hook for consumers
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Authentication State

- Login/logout functionality
- Session persistence with localStorage
- Protected routes with HOC/pattern
- User profile management

## Theme Management

Dynamic theming system with localStorage persistence:

- Dark/light mode switching
- CSS custom property updates

## Internationalization

Multi-language support with react-i18next:

- Language switching without page reload
- Translation namespaces
- Pluralization support
- Date/number formatting

## Data Persistence

LocalStorage-based data persistence for offline functionality:

- Typed data serialization
- Migration support for schema changes
- Error handling for storage failures
- Cache invalidation strategies

## Toast Notifications

Global notification system:

- Types (success, error, warning, info)
- Auto-dismiss functionality
- Queue management
- Positioning options

