import { TextStyle } from 'react-native';

/**
 * Type scale.
 *
 * Plus Jakarta Sans throughout — a deliberate choice, never the platform
 * default. React Native cannot synthesise weights for a custom family, so each
 * step names its own loaded face rather than setting `fontWeight`.
 *
 * The scale follows the iOS habit of a very large, tightly tracked display
 * size sitting directly above small, quiet supporting text: hierarchy comes
 * from the size jump, not from decoration.
 */

export const font = {
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const type = {
  /** Screen hero, e.g. "Market Pulse". */
  display: {
    fontFamily: font.extrabold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.2,
  } as TextStyle,

  /** Screen title on detail views. */
  title1: {
    fontFamily: font.extrabold,
    fontSize: 27,
    lineHeight: 32,
    letterSpacing: -0.7,
  } as TextStyle,

  /** Section and card headings. */
  title2: {
    fontFamily: font.bold,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.35,
  } as TextStyle,

  /** Metric values, list primary text. */
  headline: {
    fontFamily: font.bold,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.2,
  } as TextStyle,

  /** Default reading size. */
  body: {
    fontFamily: font.medium,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.1,
  } as TextStyle,

  /** Buttons and chips. */
  callout: {
    fontFamily: font.semibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.1,
  } as TextStyle,

  /** Secondary row text. */
  footnote: {
    fontFamily: font.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.05,
  } as TextStyle,

  /** Labels, timestamps. */
  caption: {
    fontFamily: font.semibold,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  /** Eyebrow labels. Always paired with uppercase + tracking. */
  overline: {
    fontFamily: font.bold,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;
