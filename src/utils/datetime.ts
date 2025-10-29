/**
 * Format a Date or date-like value into a short, localized date-time string.
 * - Falls back gracefully if input is invalid.
 * - Uses the current document locale by default; can override via `locale`.
 *
 * Examples:
 *   formatDateTime('2025-01-01T12:00:00Z')
 *   formatDateTime(new Date(), 'nl-NL')
 */
export function formatDateTime(input: string | number | Date, locale?: string): string {
  try {
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    const loc = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
    const fmt = new Intl.DateTimeFormat(loc, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    return fmt.format(d);
  } catch {
    return '';
  }
}

