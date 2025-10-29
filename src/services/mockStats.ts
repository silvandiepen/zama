export type KeyStats = {
  totalCalls: number;
  totalErrors: number;
  hourlyData: number[]; // 24 numbers per hour (renamed from last24h)
  last24h: number[]; // 24 numbers per hour (for backward compatibility)
  last14Days: number[]; // 14 numbers per day
};

const STORAGE_KEY = 'mock-db:key-stats';

/**
 * Gets the stats store from localStorage.
 * @returns {Record<string, KeyStats>} The stats store object.
 */
function getStore(): Record<string, KeyStats> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {} as Record<string, KeyStats>;
  }
}

/**
 * Sets the stats store in localStorage.
 * @param {Record<string, KeyStats>} store - The stats store to save.
 */
function setStore(store: Record<string, KeyStats>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * Generates a random number between min and max (inclusive).
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random number between min and max.
 */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets usage statistics for API keys.
 * @param {string} [id] - Optional specific key ID to get stats for.
 * @returns {Promise<KeyStats>} Key usage statistics.
 */
export async function getKeyStats(id?: string): Promise<KeyStats> {
  const store = getStore();
  
  if (id) {
    // Return stats for specific key
    let s = store[id];
    if (!s) {
      // generate mock stats
      const last24h = Array.from({ length: 24 }, () => rand(0, 40));
      const last14Days = Array.from({ length: 14 }, () => rand(10, 300));
      const totalCalls = last14Days.reduce((a, b) => a + b, 0) + last24h.reduce((a, b) => a + b, 0);
      const totalErrors = Math.floor(totalCalls * 0.03);
      s = { totalCalls, totalErrors, hourlyData: last24h, last24h, last14Days };
      store[id] = s;
      setStore(store);
    }
    return new Promise((res) => setTimeout(() => res(s), 120));
  } else {
    // Return aggregated stats for all keys
    const allIds = Object.keys(store);
    let totalCalls = 0;
    let totalErrors = 0;
    let hourlyData = Array(24).fill(0);
    
    allIds.forEach(keyId => {
      const stats = store[keyId];
      if (stats) {
        totalCalls += stats.totalCalls;
        totalErrors += stats.totalErrors;
        
        // Handle legacy stats without hourlyData
        const dataToUse = stats.hourlyData || stats.last24h;
        if (dataToUse) {
          dataToUse.forEach((val, i) => {
            hourlyData[i] += val;
          });
        }
        
        // Migrate legacy stats to include hourlyData
        if (!stats.hourlyData && stats.last24h) {
          stats.hourlyData = stats.last24h;
          store[keyId] = stats;
        }
      }
    });

    // If no stats exist, generate mock aggregated data
    if (totalCalls === 0) {
      hourlyData = Array.from({ length: 24 }, () => rand(10, 100));
      totalCalls = hourlyData.reduce((a, b) => a + b, 0);
      totalErrors = Math.floor(totalCalls * 0.03);
    }

    const aggregatedStats: KeyStats = {
      totalCalls,
      totalErrors,
      hourlyData: hourlyData,
      last24h: hourlyData,
      last14Days: Array.from({ length: 14 }, () => rand(100, 500))
    };

    return new Promise((res) => setTimeout(() => res(aggregatedStats), 120));
  }
}

