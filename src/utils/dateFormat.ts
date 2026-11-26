/**
 * Safely parses date strings without UTC-to-local day-shift bugs.
 * Pure YYYY-MM-DD strings are parsed in the user's local timezone instead of UTC midnight.
 */
export function parseLocalDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Match date-only format: YYYY-MM-DD
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    return new Date(year, month - 1, day, 12, 0, 0);
  }

  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats a date string in Spanish locale ('26 de noviembre de 2026' or '26 nov 2026')
 * preserving the exact calendar date for YYYY-MM-DD values.
 */
export function formatDisplayDate(
  dateStr?: string,
  monthStyle: 'long' | 'short' = 'long'
): string {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr;

  try {
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: monthStyle,
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns today's date (plus optional offsetDays) as YYYY-MM-DD in local timezone.
 */
export function getTodayLocalYYYYMMDD(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
