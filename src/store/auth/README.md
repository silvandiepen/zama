# Auth Store

Authentication store for managing user authentication state.

## Features

- User authentication (signin, signout, guest access)
- JWT token management
- User session persistence
- Auth state management

## Usage

```typescript
import { useAuth, AuthProvider } from '@/store/auth';

// Provider setup
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Using the auth hook
function LoginComponent() {
  const { user, signin, signout, signinGuest, loading } = useAuth();
  
  // Your auth logic here
}
```

## API

### `useAuth()`

Returns an object with:

- `user: User | null` - Current user object
- `loading: boolean` - Loading state
- `signin: (name: string) => void` - Sign in user
- `signout: () => void` - Sign out user
- `signinGuest: () => void` - Sign in as guest

### `AuthProvider`

Provider component that wraps your app to provide authentication context.

## Models

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}
```