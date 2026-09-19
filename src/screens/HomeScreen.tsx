import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchField } from '../components/SearchField';
import { SummaryCard } from '../components/SummaryCard';
import { TradeCard } from '../components/TradeCard';
import { MOCK_TRADES } from '../data/mockTrades';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, spacing, typography } from '../theme/colors';
import type { InsiderTrade, SignalStrength } from '../types/trade';
import { MOCK_NOW, formatCompactCurrency, formatDate } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const LATEST_COUNT = 4;
const TOP_SIGNAL_COUNT = 3;

type SignalGroup = {
  signal: string;
  count: number;
  total: number;
  strength: SignalStrength;
};

const STRENGTH_TINT: Record<SignalStrength, string> = {
  High: colors.accentAlt,
  Medium: colors.accent,
  Low: colors.textMuted,
};

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  /**
   * Every headline number is computed from the same local array that feeds the
   * list below, so the summary and the feed can never disagree.
   */
  const pulse = useMemo(() => {
    const purchases = MOCK_TRADES.filter((t) => t.type === 'purchase');
    const sales = MOCK_TRADES.filter((t) => t.type === 'sale');

    const purchaseValue = purchases.reduce((sum, t) => sum + t.value, 0);
    const saleValue = sales.reduce((sum, t) => sum + t.value, 0);
    const highCount = MOCK_TRADES.filter((t) => t.signalStrength === 'High').length;

    const byRecency = [...MOCK_TRADES].sort((a, b) => b.filedAt.localeCompare(a.filedAt));

    const grouped = new Map<string, SignalGroup>();
    for (const trade of MOCK_TRADES) {
      const existing = grouped.get(trade.signal);
      if (existing) {
        existing.count += 1;
        existing.total += trade.value;
      } else {
        grouped.set(trade.signal, {
          signal: trade.signal,
          count: 1,
          total: trade.value,
          strength: trade.signalStrength,
        });
      }
    }
    const topSignals = [...grouped.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_SIGNAL_COUNT);

    return {
      purchaseValue,
      saleValue,
      purchaseCount: purchases.length,
      saleCount: sales.length,
      highCount,
      latest: byRecency.slice(0, LATEST_COUNT),
      topSignals,
    };
  }, []);

  const openScreener = (autoFocusSearch: boolean) =>
    navigation.navigate('Screener', { autoFocusSearch });

  const openDetails = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

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
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Market Pulse</Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>FICTIONAL DEMO DATA</Text>
          </View>
        </View>
        <Text style={styles.subheading}>
          A prototype feed of invented insider disclosures · {formatDate(MOCK_NOW)}
        </Text>
      </View>

      <SearchField mode="button" onPress={() => openScreener(true)} />

      <View style={styles.summaryRow}>
        <SummaryCard
          label="Filings"
          value={String(MOCK_TRADES.length)}
          caption="Demo disclosures in feed"
          accent={colors.accent}
        />
        <SummaryCard
          label="Purchases"
          value={formatCompactCurrency(pulse.purchaseValue)}
          caption={`Across ${pulse.purchaseCount} demo buys`}
          accent={colors.purchase}
        />
        <SummaryCard
          label="Sales"
          value={formatCompactCurrency(pulse.saleValue)}
          caption={`Across ${pulse.saleCount} demo sales`}
          accent={colors.sale}
        />
      </View>

      <View style={styles.strengthStrip}>
        <Ionicons name="pulse" size={16} color={colors.accentAlt} />
        <Text style={styles.strengthText}>
          <Text style={styles.strengthCount}>{pulse.highCount} high-strength</Text> demo signals in
          the current set
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TOP SIGNALS TODAY</Text>
        <Text style={styles.sectionNote}>
          Invented grouping labels, ordered by demo value. Not recommendations.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.signalRow}
        >
          {pulse.topSignals.map((group) => (
            <View key={group.signal} style={styles.signalCard}>
              <View style={[styles.signalDot, { backgroundColor: STRENGTH_TINT[group.strength] }]} />
              <Text style={styles.signalName} numberOfLines={2}>
                {group.signal}
              </Text>
              <Text style={styles.signalTotal}>{formatCompactCurrency(group.total)}</Text>
              <Text style={styles.signalCount}>
                {group.count} demo filing{group.count === 1 ? '' : 's'}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeadRow}>
          <Text style={styles.sectionTitle}>LATEST ACTIVITY</Text>
          <Pressable
            onPress={() => openScreener(false)}
            accessibilityRole="button"
            accessibilityLabel="View all demo trades in the screener"
            hitSlop={8}
            style={({ pressed }) => [styles.viewAll, pressed && styles.viewAllPressed]}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.accent} />
          </Pressable>
        </View>

        <View style={styles.feed}>
          {pulse.latest.map((trade) => (
            <TradeCard key={trade.id} trade={trade} onPress={openDetails} dense />
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => openScreener(false)}
        accessibilityRole="button"
        accessibilityLabel={`Browse all ${MOCK_TRADES.length} demo trades`}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Ionicons name="options-outline" size={18} color={colors.background} />
        <Text style={styles.ctaText}>Browse all {MOCK_TRADES.length} demo trades</Text>
      </Pressable>

      <Text style={styles.footNote}>
        Original mobile concept inspired by the broad insider-activity product category; all
        displayed content is fictional mock/demo data.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, gap: spacing.lg },

  header: { gap: spacing.xs },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  heading: { ...typography.display, color: colors.textPrimary },
  demoBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentAltSoft,
    borderWidth: 1,
    borderColor: colors.accentAlt,
  },
  demoBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8, color: colors.accentAlt },
  subheading: { fontSize: 13, fontWeight: '500', color: colors.textMuted, lineHeight: 18 },

  summaryRow: { flexDirection: 'row', gap: spacing.xs },

  strengthStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundLift,
    borderWidth: 1,
    borderColor: colors.border,
  },
  strengthText: { flex: 1, fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  strengthCount: { color: colors.accentAlt, fontWeight: '700' },

  section: { gap: spacing.sm },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...typography.section, color: colors.textMuted },
  sectionNote: { fontSize: 11, fontWeight: '500', color: colors.textMuted, marginTop: -4 },

  signalRow: { gap: spacing.xs, paddingRight: spacing.md },
  signalCard: {
    width: 148,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 4,
  },
  signalDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  signalName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 17 },
  signalTotal: { fontSize: 15, fontWeight: '800', color: colors.textSecondary },
  signalCount: { fontSize: 11, fontWeight: '500', color: colors.textMuted },

  feed: { gap: spacing.sm },

  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllPressed: { opacity: 0.6 },
  viewAllText: { ...typography.label, color: colors.accent },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  ctaPressed: { opacity: 0.85 },
  ctaText: { fontSize: 14, fontWeight: '800', color: colors.background },

  footNote: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
  },
});
