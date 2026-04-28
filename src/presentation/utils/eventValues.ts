const MISSING_EVENT_VALUES = new Set(['', 'N/A', 'NA', 'NULL', 'NONE', '-', '--']);

export function hasEventValue(value: string | null | undefined): boolean {
  const normalized = value?.trim().toUpperCase() ?? '';
  return !MISSING_EVENT_VALUES.has(normalized);
}

export function formatEventValue(
  value: string | null | undefined,
  fallback: string = '--'
): string {
  return hasEventValue(value) ? value!.trim() : fallback;
}
