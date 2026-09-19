import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';

type Props = {
  label: string;
  value: string;
  caption: string;
  /** Tints the value only; label and caption stay neutral. */
  tint?: string;
  index?: number;
};

/**
 * One derived metric from the local feed.
 *
 * A white card on the green hero, so the three headline numbers read as a
 * single instrument panel against the dark top of the page. The caption always
 * names what the figure is measured over, so a total can never be read as a
 * live market number.
 */
export function SummaryCard({ label, value, caption, tint = colors.ink, index = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(80 + index * 70).duration(420).springify().damping(18)}
      style={styles.card}
    >
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, { color: tint }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
      >
        {value}
      </Text>
      <Text style={styles.caption} numberOfLines={2}>
        {caption}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  label: { ...type.overline, fontSize: 9.5, color: colors.inkTertiary },
  value: { ...type.title2, fontSize: 22, letterSpacing: -0.7 },
  caption: { ...type.caption, fontSize: 10.5, lineHeight: 14, color: colors.inkSecondary },
});
