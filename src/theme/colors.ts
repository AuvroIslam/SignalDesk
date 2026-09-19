/**
 * Design tokens.
 *
 * The palette is drawn from the app mark: a deep forest-green tile with three
 * ascending bars that brighten to lime. The home screen wears that green as a
 * full-bleed hero; every other surface is a warm near-white, so the app reads
 * as one bright, quiet document with a single dark cover.
 *
 * Two rules the palette has to keep:
 *  1. Purchase / sale direction is never carried by colour alone — every use
 *     pairs the tint with an arrow and the literal word.
 *  2. Signal strength is expressed through *contrast*, not hue, so "High" can
 *     never be mistaken for a buy recommendation.
 */

export const colors = {
  /** Warm off-white app canvas. */
  canvas: '#F5F5F1',
  /** Cards and raised rows. */
  surface: '#FFFFFF',
  /** Inset wells: filter groups, chart plots, disclaimer blocks. */
  sunken: '#F0F0EB',
  /** Pressed state for light surfaces. */
  pressed: '#E8E8E2',

  /** Full-bleed hero gradient, taken from the app mark. */
  heroTop: '#17351F',
  heroBottom: '#091610',
  /** Cards floating on the hero. */
  heroSurface: 'rgba(255, 255, 255, 0.07)',
  heroBorder: 'rgba(255, 255, 255, 0.12)',

  ink: '#0B100D',
  inkSecondary: '#5D665F',
  inkTertiary: '#8D948E',
  hairline: 'rgba(11, 16, 13, 0.08)',
  hairlineStrong: 'rgba(11, 16, 13, 0.14)',

  onHero: '#FFFFFF',
  onHeroSecondary: 'rgba(255, 255, 255, 0.72)',
  onHeroTertiary: 'rgba(255, 255, 255, 0.48)',

  /** Lime from the brightest bar of the mark. Used sparingly, on green only. */
  lime: '#BDF579',
  limeDeep: '#8ED04B',

  /** Purchase. Always rendered with an up arrow and the word "Purchase". */
  positive: '#1B9E55',
  positiveSoft: '#E3F5EA',
  positiveOnHero: '#8FE3AC',

  /** Sale. Always rendered with a down arrow and the word "Sale". */
  negative: '#DC5138',
  negativeSoft: '#FBEAE5',
  negativeOnHero: '#F5A992',

  /** Scrim behind the filter sheet. */
  scrim: 'rgba(8, 14, 10, 0.32)',
} as const;

/**
 * Signal strength styling.
 *
 * Deliberately monochrome: strength steps down in contrast (solid ink → light
 * fill → hairline outline) rather than across a red-to-green ramp. A reader
 * cannot mistake it for a direction or a rating.
 */
export const strengthStyle = {
  High: { bg: colors.ink, fg: '#FFFFFF', border: 'transparent' },
  Medium: { bg: colors.sunken, fg: colors.inkSecondary, border: 'transparent' },
  Low: { bg: 'transparent', fg: colors.inkTertiary, border: colors.hairlineStrong },
} as const;

/** 8-point rhythm, with a 4 for optical nudges only. */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
  sheet: 32,
  pill: 999,
} as const;

/** iOS minimum comfortable touch target. */
export const HIT_TARGET = 44;

/**
 * Spring curves. Matched to the feel of iOS sheet presentation: quick to
 * settle, no visible bounce on large surfaces, a little life on small ones.
 */
export const motion = {
  sheet: { damping: 30, stiffness: 320, mass: 0.9 },
  snappy: { damping: 22, stiffness: 420, mass: 0.7 },
  gentle: { damping: 26, stiffness: 240, mass: 1 },
} as const;
