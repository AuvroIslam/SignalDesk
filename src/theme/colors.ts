/**
 * Design tokens for the dark app shell.
 *
 * Transaction meaning is never carried by colour alone: every place that uses
 * `purchase` / `sale` also renders the words "Purchase" / "Sale" and a
 * directional icon, so the app stays readable without colour perception.
 */

export const colors = {
  background: '#0B1220',
  backgroundLift: '#101A2C',
  surface: '#172033',
  surfaceAlt: '#1F2937',
  border: '#25344E',
  borderStrong: '#35496B',

  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#8496B2',

  purchase: '#22C55E',
  purchaseSoft: 'rgba(34, 197, 94, 0.14)',
  sale: '#F97316',
  saleSoft: 'rgba(249, 115, 22, 0.14)',

  accent: '#60A5FA',
  accentSoft: 'rgba(96, 165, 250, 0.16)',
  accentAlt: '#A78BFA',
  accentAltSoft: 'rgba(167, 139, 250, 0.16)',

  chartLine: '#60A5FA',
  chartFill: 'rgba(96, 165, 250, 0.18)',
  chartGrid: 'rgba(148, 163, 184, 0.16)',
} as const;

/** 8-point rhythm used for every margin, padding and gap in the app. */
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.4 },
  title: { fontSize: 19, fontWeight: '700' as const, letterSpacing: -0.2 },
  section: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 1.1 },
  body: { fontSize: 14, fontWeight: '500' as const },
  label: { fontSize: 12, fontWeight: '600' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.4 },
} as const;

/** Minimum comfortable touch target for icon-only controls. */
export const HIT_TARGET = 44;
