import type { ApiKey, CreateApiKeyInput } from "@/types/apikey";

export type KeysState = {
  loading: boolean;
  items: ApiKey[];
};

export type Action =
  | { type: "loading"; value: boolean }
  | { type: "set"; items: ApiKey[] }
  | { type: "add"; item: ApiKey }
  | { type: "remove"; id: string }
  | { type: "update"; item: ApiKey };

export type KeysCtx = {
  state: KeysState;
  loadKeys: () => Promise<void>;
  createKey: (input: CreateApiKeyInput) => Promise<ApiKey>;
  deleteKey: (id: string) => Promise<void>;
  revokeKey: (id: string) => Promise<ApiKey | undefined>;
  updateKey: (partial: Partial<ApiKey> & { id: string }) => Promise<ApiKey | undefined>;
  regenerateKey: (id: string) => Promise<ApiKey | undefined>;
  decryptKey: (id: string) => Promise<string | null>;
};

export const STORAGE_KEY = "zama-app:keys-state";