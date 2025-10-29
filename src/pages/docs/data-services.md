# Data Services Architecture

## Mock Service Pattern

We simulate real API services with async patterns and realistic delays:

```
export async function getKeyStats(id?: string): Promise<KeyStats> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 120));

  // Generate or retrieve mock data
  const stats = generateMockStats(id);
  return stats;
}
```

## Service Layer Organization

### Mock Statistics Service

Handles usage analytics and metrics:

- Individual key statistics
- Aggregated dashboard metrics
- Time-series data generation
- Performance analytics

### Data Generation Patterns

Realistic mock data generation:

- Randomized but consistent data
- Time-based data series
- Error rate simulation
- Usage pattern modeling

## Storage Management

LocalStorage abstraction with type safety:

```
function getStore(): Record<string, KeyStats> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {} as Record<string, KeyStats>;
  }
}
```

## Error Handling

Robust error handling throughout the data layer:

- Graceful degradation for storage failures
- Data validation and sanitization
- Retry mechanisms for failed operations
- User-friendly error messages

## Performance Optimizations

Efficient data handling and caching strategies:

- Lazy data loading
- Debounced updates
- Computed properties for expensive calculations
- Memory management for large datasets

