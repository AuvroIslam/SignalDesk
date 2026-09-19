import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/colors';
import type { InsiderTrade } from '../types/trade';
import { formatCompactCurrency, formatRelative, tradeTypeLabel } from '../utils/formatters';
import { SignalBadge } from './SignalBadge';

type Props = {
  trade: InsiderTrade;
  onPress: (trade: InsiderTrade) => void;
  /** Compact variant used in the shorter Home feed. */
  dense?: boolean;
};

export function TradeCard({ trade, onPress, dense = false }: Props) {
  const isPurchase = trade.type === 'purchase';
  const tint = isPurchase ? colors.purchase : colors.sale;
  const tintSoft = isPurchase ? colors.purchaseSoft : colors.saleSoft;
  const typeLabel = tradeTypeLabel(trade.type);

  return (
    <Pressable
      onPress={() => onPress(trade)}
      accessibilityRole="button"
      accessibilityLabel={`${trade.company}, ${trade.ticker}. ${typeLabel} of ${formatCompactCurrency(
        trade.value,
      )} by ${trade.insider}, ${trade.role}. Signal strength ${trade.signalStrength}. Demo data.`}
      accessibilityHint="Opens the fictional filing details"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headRow}>
        <View style={[styles.tickerChip, { backgroundColor: tintSoft, borderColor: tint }]}>
          <Text style={[styles.ticker, { color: tint }]}>{trade.ticker}</Text>
        </View>

        <View style={styles.identity}>
          <Text style={styles.company} numberOfLines={1}>
            {trade.company}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {trade.insider} · {trade.role}
          </Text>
        </View>

        <View style={styles.amountColumn}>
          <Text style={[styles.amount, { color: tint }]} numberOfLines={1}>
            {formatCompactCurrency(trade.value)}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            {formatRelative(trade.filedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.footRow}>
        {/* Direction is stated three ways: icon, word and colour. */}
        <View style={[styles.typePill, { backgroundColor: tintSoft }]}>
          <Ionicons
            name={isPurchase ? 'arrow-up-circle' : 'arrow-down-circle'}
            size={14}
            color={tint}
          />
          <Text style={[styles.typeText, { color: tint }]}>{typeLabel}</Text>
        </View>

        {!dense && <Text style={styles.sector} numberOfLines={1}>{trade.sector}</Text>}

        <View style={styles.badgeWrap}>
          <SignalBadge strength={trade.signalStrength} label={trade.signal} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardPressed: { backgroundColor: colors.surfaceAlt, borderColor: colors.borderStrong },

  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tickerChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  ticker: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },

  identity: { flex: 1, minWidth: 0, gap: 2 },
  company: { ...typography.body, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  meta: { fontSize: 12, fontWeight: '500', color: colors.textMuted },

  amountColumn: { alignItems: 'flex-end', gap: 2, flexShrink: 0 },
  amount: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  time: { fontSize: 11, fontWeight: '500', color: colors.textMuted },

  footRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
  },
  typeText: { ...typography.micro },
  sector: { fontSize: 11, fontWeight: '500', color: colors.textMuted, flexShrink: 1 },
  badgeWrap: { marginLeft: 'auto', flexShrink: 1 },
});
