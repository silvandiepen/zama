// Simple mock DB service using localStorage with artificial latency
import type { ApiKey, CreateApiKeyInput } from "@/types/apikey";
import { encryptionService } from "./encryption";

const STORAGE_KEY = "mock-db:keys";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Reads all API keys from localStorage.
 * @returns {ApiKey[]} Array of stored API keys.
 */
function readAll(): ApiKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let keys = raw ? (JSON.parse(raw) as ApiKey[]) : [];
    
    // Migration: Fix any unmasked keys (legacy data)
    keys = keys.map(key => {
      // Check if key appears to be unmasked (no dots and longer than 8 chars)
      // Remove the !key.encryptedKey condition to handle all unmasked keys
      if (key.key && !key.key.includes('•') && key.key.length > 8) {
        // This looks like an unmasked legacy key - mask it
        const maskedKey = `${key.key.substring(0, 8)}${'•'.repeat(key.key.length - 8)}`;
        console.log(`Migrating unmasked key to masked format: ${key.key.substring(0, 8)}...`);
        return { ...key, key: maskedKey };
      }
      return key;
    });
    
    // Save the migrated keys back to localStorage
    if (keys.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    }
    
    return keys;
  } catch {
    return [];
  }
}

/**
 * Writes API keys to localStorage.
 * @param {ApiKey[]} keys - Array of API keys to store.
 */
function writeAll(keys: ApiKey[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

/**
 * Retrieves all API keys from the mock database.
 * @returns {Promise<ApiKey[]>} Array of API keys.
 */
export async function dbGetKeys(): Promise<ApiKey[]> {
  await delay(150);
  return readAll();
}

/**
 * Creates a new API key with encryption.
 * @param {CreateApiKeyInput} input - Input data for creating the API key.
 * @returns {Promise<ApiKey>} The created API key with plaintext key for one-time display.
 */
export async function dbCreateKey(input: CreateApiKeyInput): Promise<ApiKey> {
  await delay(300); // Increased delay for "encryption"
  const now = new Date().toISOString();
  
  // Generate encrypted key
  const plaintextKey = input.key ?? generateApiKey(32);
  const encryptedKey = await encryptionService.encryptKey(plaintextKey);
  
  const key: ApiKey = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    key: `${plaintextKey.substring(0, 8)}${'•'.repeat(plaintextKey.length - 8)}`, // Masked representation
    encryptedKey, // The actual encrypted key
    createdAt: now,
    revoked: false,
    revokedAt: null,
    readRules: input.readRules ?? ["keys"],
    writeRules: input.writeRules ?? [],
    revealOnceSeen: true, // Only show full value at creation in a one-time modal
    lastRegeneratedAt: null,
    encryptionInfo: {
      ...encryptionService.getEncryptionInfo(),
      checksum: encryptionService.generateChecksum(plaintextKey),
    },
  };
  const all = readAll();
  all.unshift(key);
  writeAll(all);
  return { ...key, key: plaintextKey }; // Return plaintext for one-time display
}

/**
 * Deletes an API key by ID.
 * @param {string} id - The ID of the API key to delete.
 * @returns {Promise<void>}
 */
export async function dbDeleteKey(id: string): Promise<void> {
  await delay(150);
  const all = readAll().filter((k) => k.id !== id);
  writeAll(all);
}

/**
 * Revokes an API key by ID.
 * @param {string} id - The ID of the API key to revoke.
 * @returns {Promise<ApiKey | undefined>} The revoked API key or undefined if not found.
 */
export async function dbRevokeKey(id: string): Promise<ApiKey | undefined> {
  await delay(150);
  const all = readAll();
  const idx = all.findIndex((k) => k.id === id);
  if (idx === -1) return undefined;
  const updated: ApiKey = {
    ...all[idx],
    revoked: true,
    revokedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

/**
 * Updates an API key with partial data.
 * @param {Partial<ApiKey> & { id: string }} partial - Partial API key data including ID.
 * @returns {Promise<ApiKey | undefined>} The updated API key or undefined if not found.
 */
export async function dbUpdateKey(partial: Partial<ApiKey> & { id: string }): Promise<ApiKey | undefined> {
  await delay(150);
  const all = readAll();
  const idx = all.findIndex((k) => k.id === partial.id);
  if (idx === -1) return undefined;
  const updated: ApiKey = { ...all[idx], ...partial } as ApiKey;
  all[idx] = updated;
  writeAll(all);
  return updated;
}

/**
 * Regenerates an API key with new encrypted value.
 * @param {string} id - The ID of the API key to regenerate.
 * @returns {Promise<ApiKey | undefined>} The regenerated API key with plaintext key for one-time display.
 */
export async function dbRegenerateKey(id: string): Promise<ApiKey | undefined> {
  await delay(250); // Increased delay for "encryption"
  const all = readAll();
  const idx = all.findIndex((k) => k.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  
  // Generate new encrypted key
  const plaintextKey = generateApiKey(32);
  const encryptedKey = await encryptionService.encryptKey(plaintextKey);
  
  const updated: ApiKey = {
    ...all[idx],
    key: `${plaintextKey.substring(0, 8)}${'•'.repeat(plaintextKey.length - 8)}`, // Masked representation
    encryptedKey, // New encrypted key
    lastRegeneratedAt: now,
    // Only visible in immediate reveal modal; not revealable later
    revealOnceSeen: true,
    encryptionInfo: {
      algorithm: all[idx].encryptionInfo?.algorithm || 'TFHE',
      provider: all[idx].encryptionInfo?.provider || 'Zama TFHE',
      version: all[idx].encryptionInfo?.version || '1.0.0',
      checksum: encryptionService.generateChecksum(plaintextKey),
    },
  };
  all[idx] = updated;
  writeAll(all);
  return { ...updated, key: plaintextKey }; // Return plaintext for one-time display
}

/**
 * Generates a new random API key.
 * @param {number} [length=32] - Length of the random part of the key.
 * @returns {string} A new API key in Zama format.
 */
export function generateApiKey(length = 32): string {
  // URL-safe base64-like key with Zama prefix
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  const randomPart = Array.from(arr)
    .map((b) => (b % 64))
    .map((v) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[v])
    .join("");
  return `zmk_v1_${randomPart}`; // Zama Key v1 format
}

/**
 * Decrypts an API key by ID.
 * @param {string} id - The ID of the API key to decrypt.
 * @returns {Promise<string | null>} The decrypted API key or null if not found/failed.
 */
export async function dbDecryptKey(id: string): Promise<string | null> {
  await delay(100); // Simulate decryption time
  const all = readAll();
  const key = all.find((k) => k.id === id);
  if (!key?.encryptedKey) return null;
  
  const result = await encryptionService.decryptKey(key.encryptedKey);
  return result.success ? result.key || null : null;
}
