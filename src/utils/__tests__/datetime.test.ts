import { describe, it, expect } from 'vitest';
import { formatDateTime } from '../datetime';

describe('formatDateTime', () => {
  it('formats a valid date', () => {
    const out = formatDateTime('2025-01-02T03:04:00Z', 'en-US');
    expect(out).toBeTruthy();
  });

  it('returns empty for invalid date', () => {
    const out = formatDateTime('not-a-date', 'en-US');
    expect(out).toBe('');
  });

  it('respects locale', () => {
    const us = formatDateTime('2025-01-02T03:04:00Z', 'en-US');
    const nl = formatDateTime('2025-01-02T03:04:00Z', 'nl-NL');
    expect(us).not.toEqual(nl);
  });
});

