import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/colors';
import type { SignalStrength } from '../types/trade';

type Props = {
  strength: SignalStrength;
  /** Optional signal name shown next to the strength, e.g. "Cluster Buy". */
  label?: string;
};

/**
 * Strength is a neutral interface label describing how prominent a demo filing
 * is in this feed — not a rating, score or recommendation. The three tints are
 * intentionally analytic (violet / blue / grey) rather than green-vs-red, so
 * strength is never confused with the purchase-vs-sale direction.
 */
const TINTS: Record<SignalStrength, { fg: string; bg: string }> = {
  High: { fg: colors.accentAlt, bg: colors.accentAltSoft },
  Medium: { fg: colors.accent, bg: colors.accentSoft },
  Low: { fg: colors.textMuted, bg: 'rgba(132, 150, 178, 0.14)' },
};

export function SignalBadge({ strength, label }: Props) {
  const tint = TINTS[strength];
  return (
    <View style={[styles.badge, { backgroundColor: tint.bg }]}>
      <View style={[styles.dot, { backgroundColor: tint.fg }]} />
      <Text style={[styles.text, { color: tint.fg }]} numberOfLines={1}>
        {label ? `${strength} · ${label}` : strength}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    flexShrink: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { ...typography.micro, flexShrink: 1 },
});
