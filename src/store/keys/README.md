# Keys Store

API keys management store for handling encrypted API keys with Zama TFHE encryption.

## Features

- CRUD operations for API keys
- Post-quantum encryption using Zama TFHE
- Key access control (read/write permissions)
- Key revocation and regeneration
- Encrypted key storage and retrieval

## Usage

```typescript
import { useKeys, KeysProvider } from '@/store/keys';

// Provider setup
function App() {
  return (
    <KeysProvider>
      <YourApp />
    </KeysProvider>
  );
}

// Using the keys hook
function ApiKeyManager() {
  const { 
    state, 
    createKey, 
    updateKey, 
    deleteKey, 
    revokeKey, 
    regenerateKey,
    decryptKey,
    loadKeys 
  } = useKeys();
  
  // Your key management logic here
}
```

## API

### `useKeys()`

Returns an object with:

- `state: KeysState` - Current keys state
- `createKey: (data: CreateKeyData) => Promise<ApiKey>` - Create new key
- `updateKey: (data: UpdateKeyData) => Promise<ApiKey | null>` - Update existing key
- `deleteKey: (id: string) => Promise<void>` - Delete key
- `revokeKey: (id: string) => Promise<void>` - Revoke key
- `regenerateKey: (id: string) => Promise<ApiKey | null>` - Regenerate key
- `decryptKey: (id: string) => Promise<string | null>` - Decrypt key
- `loadKeys: () => Promise<void>` - Load all keys

### `KeysProvider`

Provider component that wraps your app to provide keys context.

## Models

```typescript
interface ApiKey {
  id: string;
  title: string;
  description?: string;
  key: string; // Encrypted key
  encryptionInfo?: {
    algorithm: string;
    version: string;
  };
  readRules: string[];
  writeRules: string[];
  createdAt: string;
  updatedAt?: string;
  revoked?: boolean;
  revokedAt?: string;
}

interface KeysState {
  items: ApiKey[];
  loading: boolean;
  error?: string;
}
```