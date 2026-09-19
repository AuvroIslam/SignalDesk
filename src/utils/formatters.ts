/**
 * Presentation helpers.
 *
 * Dates are parsed and formatted by hand instead of via `Intl` / `toLocaleString`
 * so the demo renders identically on every device and locale, and so the mock
 * "now" stays fixed rather than drifting with the real clock.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Fixed reference point for the demo feed, so "2h ago" never goes stale. */
export const MOCK_NOW = '2026-09-19T16:00:00';

type ParsedMockDate = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function parseMockDate(value: string): ParsedMockDate {
  const [datePart, timePart = '00:00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute };
}

/** Minutes since an arbitrary epoch — only ever used to diff two mock dates. */
function toMinutes(d: ParsedMockDate): number {
  const days = Date.UTC(d.year, d.month - 1, d.day) / 86_400_000;
  return days * 1440 + d.hour * 60 + d.minute;
}

function withThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** "$2.40M" / "$680K" / "$940" — compact enough for a card. */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${withThousands(String(Math.round(value)))}`;
}

/** "$2,400,000" for the details breakdown. */
export function formatFullCurrency(value: number): string {
  return `$${withThousands(String(Math.round(value)))}`;
}

/** "$100.00" */
export function formatPrice(value: number): string {
  return `$${withThousands(String(Math.floor(value)))}.${Math.round((value % 1) * 100)
    .toString()
    .padStart(2, '0')}`;
}

/** "24,000 shares" */
export function formatShares(shares: number): string {
  return `${withThousands(String(shares))} share${shares === 1 ? '' : 's'}`;
}

/** "Sep 10, 2026" */
export function formatDate(value: string): string {
  const d = parseMockDate(value);
  return `${MONTHS[d.month - 1]} ${d.day}, ${d.year}`;
}

/** "Sep 11, 2026 · 09:24" */
export function formatDateTime(value: string): string {
  const d = parseMockDate(value);
  const hh = String(d.hour).padStart(2, '0');
  const mm = String(d.minute).padStart(2, '0');
  return `${formatDate(value)} · ${hh}:${mm}`;
}

/** "18m ago" / "4h ago" / "2d ago", measured against the fixed mock clock. */
export function formatRelative(value: string, now: string = MOCK_NOW): string {
  const diff = toMinutes(parseMockDate(now)) - toMinutes(parseMockDate(value));
  if (diff < 1) return 'just now';
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  const days = Math.floor(diff / 1440);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

/** Word-form label — always rendered alongside the colour, never replaced by it. */
export function tradeTypeLabel(type: 'purchase' | 'sale'): string {
  return type === 'purchase' ? 'Purchase' : 'Sale';
}
