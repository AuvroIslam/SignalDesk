import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, strengthStyle } from '../theme/colors';
import { type } from '../theme/type';
import type { SignalStrength } from '../types/trade';

type Props = {
  strength: SignalStrength;
  /** Render for a dark green surface instead of a light one. */
  onHero?: boolean;
};

/**
 * Strength shown as contrast, not colour.
 *
 * High is a solid ink pill, Medium a soft grey fill, Low a hairline outline.
 * Nothing here borrows the purchase/sale palette, so prominence in the feed is
 * never readable as a recommendation.
 */
export function SignalBadge({ strength, onHero = false }: Props) {
  const tone = strengthStyle[strength];

  if (onHero) {
    const heroTone = {
      High: { bg: colors.onHero, fg: colors.ink },
      Medium: { bg: 'rgba(255,255,255,0.16)', fg: colors.onHero },
      Low: { bg: 'transparent', fg: colors.onHeroTertiary },
    }[strength];

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: heroTone.bg,
            borderColor: strength === 'Low' ? colors.heroBorder : 'transparent',
          },
        ]}
      >
        <Text style={[styles.label, { color: heroTone.fg }]}>{strength}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Text style={[styles.label, { color: tone.fg }]}>{strength}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  label: { ...type.caption, fontSize: 10 },
});
