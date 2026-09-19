import type { InsiderTrade, ScreenerFilters } from '../types/trade';

export const DEFAULT_FILTERS: ScreenerFilters = {
  type: 'all',
  role: 'All roles',
  minValue: 0,
};

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
 * The screener's single source of truth, kept pure so it can be reasoned about
 * and tested without rendering a screen.
 *
 * Search matches ticker *or* company name, case-insensitively, and is combined
 * with every active filter rather than replacing them. "Officer" records are
 * reachable only through "All roles", which the screener states in a hint.
 */
export function filterTrades(
  trades: InsiderTrade[],
  query: string,
  filters: ScreenerFilters,
): InsiderTrade[] {
  const needle = query.trim().toLowerCase();

  return trades
    .filter((trade) => {
      const matchesQuery =
        needle.length === 0 ||
        trade.ticker.toLowerCase().includes(needle) ||
        trade.company.toLowerCase().includes(needle);

      const matchesType = filters.type === 'all' || trade.type === filters.type;
      const matchesRole = filters.role === 'All roles' || trade.role === filters.role;
      const matchesValue = trade.value >= filters.minValue;

      return matchesQuery && matchesType && matchesRole && matchesValue;
    })
    .sort((a, b) => b.filedAt.localeCompare(a.filedAt));
}
