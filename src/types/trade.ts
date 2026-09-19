/**
 * Domain model for the prototype.
 *
 * Every value that ever reaches these types is invented demo content that is
 * written by hand in `src/data/mockTrades.ts`. Nothing here is fetched, scraped
 * or derived from a real filing, market API or third-party site.
 */

export type InsiderRole = 'CEO' | 'CFO' | 'Director' | 'Officer';

export type TradeType = 'purchase' | 'sale';

export type SignalStrength = 'High' | 'Medium' | 'Low';

export type InsiderTrade = {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  insider: string;
  role: InsiderRole;
  type: TradeType;
  transactionCode: 'P' | 'S';
  shares: number;
  pricePerShare: number;
  /** Always equal to `shares * pricePerShare` so the UI stays self-consistent. */
  value: number;
  /** Fictional calendar date the demo transaction "happened". */
  transactionDate: string;
  /** Fictional date + time the demo filing was "disclosed". */
  filedAt: string;
  /** Invented interface label, not a recommendation. */
  signal: string;
  signalStrength: SignalStrength;
  /** Seven invented numbers; the details chart is drawn only from these. */
  activitySeries: number[];
};

/** Screener filter state. `all` / `All roles` / `0` mean "no narrowing". */
export type TypeFilter = 'all' | TradeType;
export type RoleFilter = 'All roles' | InsiderRole;
export type ValueFilter = 0 | 100_000 | 500_000 | 1_000_000;

export type ScreenerFilters = {
  type: TypeFilter;
  role: RoleFilter;
  minValue: ValueFilter;
};
