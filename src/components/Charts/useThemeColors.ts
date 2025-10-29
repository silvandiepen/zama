/**
 * Hook to get theme colors from CSS variables for chart components.
 * @returns {Object} Object containing theme colors for charts.
 */
export function useThemeColors() {
  // Resolve CSS variables for charts (fallbacks included)
  const root = typeof document !== 'undefined' ? document.documentElement : undefined;
  const get = (name: string, fallback: string) => {
    try {
      const v = root ? getComputedStyle(root).getPropertyValue(name).trim() : '';
      return v || fallback;
    } catch {
      return fallback;
    }
  };
  const primary = get('--color-primary', '#ffd452');
  const info = get('--color-info', '#398ae1');
  const success = get('--color-success', '#44be61');
  const error = get('--color-error', '#b0323e');
  const text = get('--color-foreground', '#06021a');
  const grid = get('--chart-grid', 'rgba(0,0,0,.12)');
  return { primary, info, success, error, text, grid };
}
