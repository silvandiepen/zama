import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { KeysProvider, useKeys } from '../index';
import type { ApiKey, CreateApiKeyInput } from '@/types/apikey';
import { STORAGE_KEY } from '../keys.model';

// Mock the mockDb services
const mockDbGetKeys = vi.fn();
const mockDbCreateKey = vi.fn();
const mockDbDeleteKey = vi.fn();
const mockDbUpdateKey = vi.fn();
const mockDbRevokeKey = vi.fn();
const mockDbRegenerateKey = vi.fn();
const mockDbDecryptKey = vi.fn();

vi.mock('@/services/mockDb', () => ({
  dbGetKeys: () => mockDbGetKeys(),
  dbCreateKey: (input: CreateApiKeyInput) => mockDbCreateKey(input),
  dbDeleteKey: (id: string) => mockDbDeleteKey(id),
  dbUpdateKey: (input: Partial<ApiKey> & { id: string }) => mockDbUpdateKey(input),
  dbRevokeKey: (id: string) => mockDbRevokeKey(id),
  dbRegenerateKey: (id: string) => mockDbRegenerateKey(id),
  dbDecryptKey: (id: string) => mockDbDecryptKey(id),
}));

// Test component to use the hook
const TestComponent = () => {
  const { state, loadKeys, createKey, deleteKey, revokeKey, updateKey, regenerateKey } = useKeys();
  const [loading, setLoading] = React.useState(false);

  const handleCreateKey = async () => {
    setLoading(true);
    try {
      await createKey({ name: 'Test Key', description: 'Test Description' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async () => {
    if (state.items.length > 0) {
      setLoading(true);
      try {
        await deleteKey(state.items[0].id);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="keys-count">{state.items.length}</div>
      <div data-testid="component-loading">{loading.toString()}</div>
      
      <button onClick={loadKeys}>Load Keys</button>
      <button onClick={handleCreateKey} disabled={loading}>
        Create Key
      </button>
      <button onClick={handleDeleteKey} disabled={loading}>
        Delete First Key
      </button>
      
      <div data-testid="keys-list">
        {state.items.map(key => (
          <div key={key.id} data-testid={`key-${key.id}`}>
            {key.name} - {key.status}
          </div>
        ))}
      </div>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <KeysProvider>
      <TestComponent />
    </KeysProvider>
  );
};

// Mock data
const mockApiKey: ApiKey = {
  id: 'test-key-1',
  name: 'Test Key',
  description: 'Test Description',
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  lastUsed: '2024-01-01T00:00:00Z',
  requests: 100,
};

describe('Keys Store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockDbGetKeys.mockResolvedValue([mockApiKey]);
    mockDbCreateKey.mockResolvedValue({
      ...mockApiKey,
      id: 'new-key',
      name: 'New Key',
    });
    mockDbDeleteKey.mockResolvedValue(undefined);
    mockDbUpdateKey.mockResolvedValue(mockApiKey);
    mockDbRevokeKey.mockResolvedValue({
      ...mockApiKey,
      status: 'revoked',
    });
    mockDbRegenerateKey.mockResolvedValue({
      ...mockApiKey,
      id: 'regenerated-key',
    });
    mockDbDecryptKey.mockResolvedValue('decrypted-key-value');
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('KeysProvider', () => {
    it('should render children without errors', () => {
      renderWithProvider();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByTestId('keys-count')).toBeInTheDocument();
    });

    it('should load keys from localStorage on mount', () => {
      const storedState = {
        loading: false,
        items: [mockApiKey],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));

      renderWithProvider();
      expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');
      
      renderWithProvider();
      expect(screen.getByTestId('keys-count')).toHaveTextContent('0');
    });

    it('should call loadKeys on mount', async () => {
      renderWithProvider();
      
      await waitFor(() => {
        expect(mockDbGetKeys).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useKeys', () => {
    it('should return initial state', () => {
      renderWithProvider();
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('keys-count')).toHaveTextContent('0');
    });

    it('should handle loadKeys', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const loadButton = screen.getByText('Load Keys');
      await user.click(loadButton);

      await waitFor(() => {
        expect(mockDbGetKeys).toHaveBeenCalledTimes(2); // Once on mount, once on click
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });
    });

    it('should handle createKey', async () => {
      const user = userEvent.setup();
      mockDbGetKeys.mockResolvedValue([]); // Start with empty keys

      renderWithProvider();

      const createButton = screen.getByText('Create Key');
      await user.click(createButton);

      await waitFor(() => {
        expect(mockDbCreateKey).toHaveBeenCalledWith({
          name: 'Test Key',
          description: 'Test Description',
        });
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });
    });

    it('should handle deleteKey', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const deleteButton = screen.getByText('Delete First Key');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockDbDeleteKey).toHaveBeenCalledWith(mockApiKey.id);
        expect(screen.getByTestId('keys-count')).toHaveTextContent('0');
      });
    });

    it('should set loading state during operations', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Create key should set loading state
      const createButton = screen.getByText('Create Key');
      await user.click(createButton);

      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      expect(screen.getByTestId('component-loading')).toHaveTextContent('true');

      // Wait for operation to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('component-loading')).toHaveTextContent('false');
      });
    });

    it('should persist state to localStorage', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(storedState.items).toHaveLength(1);
      expect(storedState.items[0].id).toBe(mockApiKey.id);
    });
  });

  describe('Advanced Operations', () => {
    it('should handle revokeKey', async () => {
      const TestComponentWithRevoke = () => {
        const { state, revokeKey } = useKeys();
        const [loading, setLoading] = React.useState(false);

        const handleRevoke = async () => {
          if (state.items.length > 0) {
            setLoading(true);
            try {
              await revokeKey(state.items[0].id);
            } finally {
              setLoading(false);
            }
          }
        };

        return (
          <div>
            <div data-testid="keys-count">{state.items.length}</div>
            <button onClick={handleRevoke} disabled={loading}>
              Revoke Key
            </button>
            <div data-testid="key-status">
              {state.items[0]?.status}
            </div>
          </div>
        );
      };

      render(
        <KeysProvider>
          <TestComponentWithRevoke />
        </KeysProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const user = userEvent.setup();
      const revokeButton = screen.getByText('Revoke Key');
      await user.click(revokeButton);

      await waitFor(() => {
        expect(mockDbRevokeKey).toHaveBeenCalledWith(mockApiKey.id);
        expect(screen.getByTestId('key-status')).toHaveTextContent('revoked');
      });
    });

    it('should handle updateKey', async () => {
      const TestComponentWithUpdate = () => {
        const { state, updateKey } = useKeys();
        const [loading, setLoading] = React.useState(false);

        const handleUpdate = async () => {
          if (state.items.length > 0) {
            setLoading(true);
            try {
              await updateKey({
                id: state.items[0].id,
                name: 'Updated Name',
              });
            } finally {
              setLoading(false);
            }
          }
        };

        return (
          <div>
            <div data-testid="keys-count">{state.items.length}</div>
            <button onClick={handleUpdate} disabled={loading}>
              Update Key
            </button>
            <div data-testid="key-name">
              {state.items[0]?.name}
            </div>
          </div>
        );
      };

      const updatedKey = { ...mockApiKey, name: 'Updated Name' };
      mockDbUpdateKey.mockResolvedValue(updatedKey);

      render(
        <KeysProvider>
          <TestComponentWithUpdate />
        </KeysProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const user = userEvent.setup();
      const updateButton = screen.getByText('Update Key');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockDbUpdateKey).toHaveBeenCalledWith({
          id: mockApiKey.id,
          name: 'Updated Name',
        });
        expect(screen.getByTestId('key-name')).toHaveTextContent('Updated Name');
      });
    });

    it('should handle regenerateKey', async () => {
      const TestComponentWithRegenerate = () => {
        const { state, regenerateKey } = useKeys();
        const [loading, setLoading] = React.useState(false);

        const handleRegenerate = async () => {
          if (state.items.length > 0) {
            setLoading(true);
            try {
              await regenerateKey(state.items[0].id);
            } finally {
              setLoading(false);
            }
          }
        };

        return (
          <div>
            <div data-testid="keys-count">{state.items.length}</div>
            <button onClick={handleRegenerate} disabled={loading}>
              Regenerate Key
            </button>
            <div data-testid="key-id">
              {state.items[0]?.id}
            </div>
          </div>
        );
      };

      const regeneratedKey = { ...mockApiKey, id: 'regenerated-key' };
      mockDbRegenerateKey.mockResolvedValue(regeneratedKey);

      render(
        <KeysProvider>
          <TestComponentWithRegenerate />
        </KeysProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const user = userEvent.setup();
      const regenerateButton = screen.getByText('Regenerate Key');
      await user.click(regenerateButton);

      await waitFor(() => {
        expect(mockDbRegenerateKey).toHaveBeenCalledWith(mockApiKey.id);
        expect(screen.getByTestId('key-id')).toHaveTextContent('regenerated-key');
      });
    });

    it('should handle decryptKey', async () => {
      const TestComponentWithDecrypt = () => {
        const { state, decryptKey } = useKeys();
        const [decryptedValue, setDecryptedValue] = React.useState<string | null>(null);

        const handleDecrypt = async () => {
          if (state.items.length > 0) {
            const value = await decryptKey(state.items[0].id);
            setDecryptedValue(value);
          }
        };

        return (
          <div>
            <div data-testid="keys-count">{state.items.length}</div>
            <button onClick={handleDecrypt}>
              Decrypt Key
            </button>
            <div data-testid="decrypted-value">
              {decryptedValue}
            </div>
          </div>
        );
      };

      render(
        <KeysProvider>
          <TestComponentWithDecrypt />
        </KeysProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('keys-count')).toHaveTextContent('1');
      });

      const user = userEvent.setup();
      const decryptButton = screen.getByText('Decrypt Key');
      await user.click(decryptButton);

      await waitFor(() => {
        expect(mockDbDecryptKey).toHaveBeenCalledWith(mockApiKey.id);
        expect(screen.getByTestId('decrypted-value')).toHaveTextContent('decrypted-key-value');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockDbGetKeys.mockRejectedValue(new Error('API Error'));
      
      renderWithProvider();
      
      // Should not crash and still render
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should handle createKey errors', async () => {
      mockDbCreateKey.mockRejectedValue(new Error('Create failed'));
      
      const user = userEvent.setup();
      renderWithProvider();

      const createButton = screen.getByText('Create Key');
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByTestId('component-loading')).toHaveTextContent('false');
      });

      // Should still render without crashing
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Context Validation', () => {
    it('should throw error when useKeys is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useKeys must be used within KeysProvider');

      consoleSpy.mockRestore();
    });
  });
});