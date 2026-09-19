import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import type { InsiderTrade } from '../types/trade';
import { formatCompactCurrency, formatRelative, tradeTypeLabel } from '../utils/formatters';
import { CompanyMark } from './CompanyMark';
import { DirectionTag } from './DirectionTag';
import { Icon } from './icons/Icon';
import { PressableScale } from './PressableScale';
import { SignalBadge } from './SignalBadge';

type Props = {
  trade: InsiderTrade;
  onPress: (trade: InsiderTrade) => void;
  /** Screener rows name the insider; home rows show how long ago it filed. */
  detailed?: boolean;
  /** Staggers the entrance so a filtered list resolves rather than snapping. */
  index?: number;
};

/**
 * One filing in the feed.
 *
 * Reading order is deliberate: mark and ticker identify it, the value is the
 * single heaviest element, and strength sits quietly beside the company name.
 * The sector is not shown here — at this width it only ever truncated, and it
 * is available in full on the details screen.
 */
export function TradeRow({ trade, onPress, detailed = false, index = 0 }: Props) {
  const isPurchase = trade.type === 'purchase';
  const valueTint = isPurchase ? colors.positive : colors.negative;

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(320).springify().damping(20)}
    >
      <PressableScale
        onPress={() => onPress(trade)}
        scaleTo={0.985}
        accessibilityRole="button"
        accessibilityLabel={`${trade.company}, ${trade.ticker}. ${tradeTypeLabel(trade.type)} of ${formatCompactCurrency(
          trade.value,
        )} by ${trade.insider}, ${trade.role}. Signal strength ${trade.signalStrength}. Demo data.`}
        accessibilityHint="Opens the fictional filing details"
        style={styles.row}
      >
        <CompanyMark ticker={trade.ticker} size={42} />

        <View style={styles.identity}>
          <View style={styles.tickerRow}>
            <Text style={styles.ticker} numberOfLines={1}>
              {trade.ticker}
            </Text>
            <SignalBadge strength={trade.signalStrength} />
          </View>
          <Text style={styles.company} numberOfLines={1}>
            {trade.company}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {detailed ? `${trade.insider} · ${trade.role}` : formatRelative(trade.filedAt)}
          </Text>
        </View>

        <View style={styles.amount}>
          <Text style={[styles.value, { color: valueTint }]} numberOfLines={1}>
            {formatCompactCurrency(trade.value)}
          </Text>
          {/* Icon + word + colour, so direction never rests on colour alone. */}
          <DirectionTag direction={trade.type} variant="inline" size={12} />
        </View>

        <Icon name="ChevronRight" size={17} color={colors.inkTertiary} strokeWidth={2} />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },

  identity: { flex: 1, minWidth: 0, gap: 2 },
  tickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ticker: { ...type.headline, fontSize: 15, color: colors.ink, flexShrink: 1 },
  company: { ...type.footnote, fontSize: 13, color: colors.inkSecondary },
  sub: { ...type.caption, fontSize: 11, color: colors.inkTertiary },

  amount: { alignItems: 'flex-end', gap: 3, flexShrink: 0 },
  value: { ...type.title2, fontSize: 16.5, letterSpacing: -0.4 },
});
