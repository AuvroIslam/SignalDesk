import type { InsiderTrade, ScreenerFilters, SortKey } from '../types/trade';

export const DEFAULT_FILTERS: ScreenerFilters = {
  type: 'all',
  role: 'All roles',
  minValue: 0,
};

export const DEFAULT_SORT: SortKey = 'recent';

/** True when the user has narrowed the feed in any way. */
export function isNarrowed(query: string, filters: ScreenerFilters): boolean {
  return (
    query.trim().length > 0 ||
    filters.type !== DEFAULT_FILTERS.type ||
    filters.role !== DEFAULT_FILTERS.role ||
    filters.minValue !== DEFAULT_FILTERS.minValue
  );
}

/**
 * How many filters are active but not visible as inline chips.
 *
 * Drives the badge on the Filter button, so the user can tell at a glance that
 * the sheet is hiding an active constraint.
 */
export function hiddenFilterCount(filters: ScreenerFilters): number {
  let count = 0;
  if (filters.role !== DEFAULT_FILTERS.role) count += 1;
  if (filters.minValue !== DEFAULT_FILTERS.minValue) count += 1;
  return count;
}

/**
 * The screener's single source of truth, kept pure so it can be reasoned about
 * and tested without rendering a screen.
 *
 * Search matches ticker *or* company name, case-insensitively, and is combined
 * with every active filter rather than replacing them. "Officer" records are
 * reachable only through "All roles", which the filter sheet states in a hint.
 */
export function filterTrades(
  trades: InsiderTrade[],
  query: string,
  filters: ScreenerFilters,
  sort: SortKey = DEFAULT_SORT,
): InsiderTrade[] {
  const needle = query.trim().toLowerCase();

  const matched = trades.filter((trade) => {
    const matchesQuery =
      needle.length === 0 ||
      trade.ticker.toLowerCase().includes(needle) ||
      trade.company.toLowerCase().includes(needle);

    const matchesType = filters.type === 'all' || trade.type === filters.type;
    const matchesRole = filters.role === 'All roles' || trade.role === filters.role;
    const matchesValue = trade.value >= filters.minValue;

    return matchesQuery && matchesType && matchesRole && matchesValue;
  });

  return matched.sort((a, b) =>
    sort === 'value' ? b.value - a.value : b.filedAt.localeCompare(a.filedAt),
  );
}
