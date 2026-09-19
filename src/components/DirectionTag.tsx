import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import type { TradeType } from '../types/trade';
import { tradeTypeLabel } from '../utils/formatters';
import { Fall, Rise } from './icons/BrandIcons';

type Props = {
  direction: TradeType;
  /** `inline` puts the arrow beside a value; `pill` is a standalone tag. */
  variant?: 'pill' | 'inline';
  onHero?: boolean;
  size?: number;
};

/**
 * The one place purchase/sale direction is rendered.
 *
 * Every variant shows an arrow *and* the word, never colour on its own, which
 * is what keeps the feed readable in greyscale and in a compressed screen
 * recording. Routing every usage through this component means that guarantee
 * cannot be forgotten at a call site.
 */
export function DirectionTag({ direction, variant = 'pill', onHero = false, size = 14 }: Props) {
  const isPurchase = direction === 'purchase';
  const label = tradeTypeLabel(direction);

  const tint = onHero
    ? isPurchase
      ? colors.positiveOnHero
      : colors.negativeOnHero
    : isPurchase
      ? colors.positive
      : colors.negative;

  if (variant === 'inline') {
    return (
      <View style={styles.inline}>
        {isPurchase ? <Rise size={size} color={tint} /> : <Fall size={size} color={tint} />}
        <Text style={[styles.inlineLabel, { color: tint }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: onHero ? colors.heroSurface : isPurchase ? colors.positiveSoft : colors.negativeSoft },
      ]}
    >
      {isPurchase ? <Rise size={size} color={tint} /> : <Fall size={size} color={tint} />}
      <Text style={[styles.pillLabel, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  inlineLabel: { ...type.caption },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: radius.pill,
    paddingLeft: spacing.xs,
    paddingRight: spacing.sm,
    paddingVertical: 5,
  },
  pillLabel: { ...type.caption, fontSize: 11.5 },
});
