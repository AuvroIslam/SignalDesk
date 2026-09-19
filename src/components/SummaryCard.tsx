import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/colors';

type Props = {
  label: string;
  value: string;
  caption: string;
  accent: string;
};

/**
 * One compact metric from the local feed. The caption always says what the
 * number is measured over, so a total can never read as a live market figure.
 */
export function SummaryCard({ label, value, caption, accent }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.rule, { backgroundColor: accent }]} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: accent }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.caption} numberOfLines={2}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  rule: { width: 22, height: 3, borderRadius: 2, marginBottom: 2 },
  label: { ...typography.micro, color: colors.textMuted, textTransform: 'uppercase' },
  value: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  caption: { fontSize: 11, fontWeight: '500', color: colors.textSecondary, lineHeight: 15 },
});
