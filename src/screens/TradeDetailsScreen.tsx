import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MockActivityChart } from '../components/MockActivityChart';
import { SignalBadge } from '../components/SignalBadge';
import { findTradeById } from '../data/mockTrades';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { HIT_TARGET, colors, radius, spacing, typography } from '../theme/colors';
import { REQUIRED_DISCLAIMER, explainTrade } from '../utils/education';
import {
  formatDate,
  formatDateTime,
  formatFullCurrency,
  formatPrice,
  formatShares,
  formatCompactCurrency,
  tradeTypeLabel,
} from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'TradeDetails'>;

export function TradeDetailsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const trade = findTradeById(route.params.tradeId);

  const back = (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back to the previous screen"
      hitSlop={8}
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
    >
      <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
    </Pressable>
  );

  // Defensive: the id always resolves from local data, but a missing record
  // should degrade to a readable screen rather than a red box.
  if (!trade) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top + spacing.md }]}>
        {back}
        <Text style={styles.missingText}>That demo filing is no longer in the local set.</Text>
      </View>
    );
  }

  const isPurchase = trade.type === 'purchase';
  const tint = isPurchase ? colors.purchase : colors.sale;
  const tintSoft = isPurchase ? colors.purchaseSoft : colors.saleSoft;
  const typeLabel = tradeTypeLabel(trade.type);

  const rows: { label: string; value: string }[] = [
    { label: 'Insider', value: `${trade.insider} · ${trade.role}` },
    { label: 'Transaction', value: `${typeLabel} · Code ${trade.transactionCode}` },
    { label: 'Shares', value: formatShares(trade.shares) },
    { label: 'Price per share', value: `${formatPrice(trade.pricePerShare)} (demo)` },
    { label: 'Total value', value: `${formatFullCurrency(trade.value)} (demo)` },
    { label: 'Transaction date', value: formatDate(trade.transactionDate) },
    { label: 'Filed date', value: formatDateTime(trade.filedAt) },
    { label: 'Signal strength', value: `${trade.signalStrength} · ${trade.signal}` },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {back}
        <View style={styles.headerText}>
          <Text style={styles.company} numberOfLines={2}>
            {trade.company}
          </Text>
          <Text style={styles.identifiers} numberOfLines={1}>
            {trade.ticker} · {trade.sector}
          </Text>
        </View>
      </View>

      <View style={styles.demoBadge}>
        <Ionicons name="information-circle-outline" size={13} color={colors.accentAlt} />
        <Text style={styles.demoBadgeText}>FICTIONAL DEMO DATA</Text>
      </View>

      <View style={[styles.signalCard, { borderColor: tint, backgroundColor: tintSoft }]}>
        <View style={styles.signalTopRow}>
          <Ionicons
            name={isPurchase ? 'arrow-up-circle' : 'arrow-down-circle'}
            size={20}
            color={tint}
          />
          <Text style={[styles.signalName, { color: tint }]} numberOfLines={2}>
            {trade.signal}
          </Text>
        </View>
        <Text style={styles.signalValue}>
          {formatCompactCurrency(trade.value)} fictional demo insider{' '}
          {isPurchase ? 'buy' : 'sale'}
        </Text>
        <SignalBadge strength={trade.signalStrength} />
      </View>

      <View style={styles.specCard}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[styles.specRow, index < rows.length - 1 && styles.specRowDivided]}
          >
            <Text style={styles.specLabel}>{row.label}</Text>
            <Text style={styles.specValue} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      <MockActivityChart series={trade.activitySeries} tint={tint} />

      <View style={styles.educationCard}>
        <Text style={styles.educationTitle}>Why this matters</Text>
        <Text style={styles.educationBody}>{explainTrade(trade)}</Text>
      </View>

      <View style={styles.disclaimerCard}>
        <Ionicons name="alert-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.disclaimerText}>{REQUIRED_DISCLAIMER}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },

  missing: { alignItems: 'flex-start', gap: spacing.md, paddingHorizontal: spacing.md },
  missingText: { ...typography.body, color: colors.textSecondary },

  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  backButton: {
    width: HIT_TARGET,
    height: HIT_TARGET,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: { backgroundColor: colors.surfaceAlt },
  headerText: { flex: 1, minWidth: 0, gap: 2 },
  company: { ...typography.title, fontSize: 20, color: colors.textPrimary },
  identifiers: { fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.3 },

  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accentAltSoft,
    borderWidth: 1,
    borderColor: colors.accentAlt,
  },
  demoBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8, color: colors.accentAlt },

  signalCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, gap: spacing.xs },
  signalTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  signalName: { flex: 1, minWidth: 0, fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  signalValue: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, lineHeight: 21 },

  specCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  specRowDivided: { borderBottomWidth: 1, borderBottomColor: colors.border },
  specLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, flexShrink: 0 },
  specValue: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },

  educationCard: {
    backgroundColor: colors.backgroundLift,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  educationTitle: { ...typography.body, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  educationBody: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, lineHeight: 20 },

  disclaimerCard: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  disclaimerText: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 16,
  },
});
