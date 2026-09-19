import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FallBars, RiseBars } from '../components/icons/BrandIcons';
import { Icon } from '../components/icons/Icon';
import { PressableScale } from '../components/PressableScale';
import { SearchField } from '../components/SearchField';
import { SummaryCard } from '../components/SummaryCard';
import { TradeRow } from '../components/TradeRow';
import { MOCK_TRADES } from '../data/mockTrades';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import type { InsiderTrade, SignalStrength, TradeType } from '../types/trade';
import { MOCK_NOW, formatCompactCurrency, formatDate } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const LATEST_COUNT = 4;
const TOP_SIGNAL_COUNT = 3;

type SignalGroup = {
  signal: string;
  count: number;
  total: number;
  strength: SignalStrength;
  direction: TradeType;
};

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  useStatusBarStyle('light');

  /**
   * Every headline number is computed from the same local array that feeds the
   * list below, so the summary and the feed can never disagree.
   */
  const pulse = useMemo(() => {
    const purchases = MOCK_TRADES.filter((t) => t.type === 'purchase');
    const sales = MOCK_TRADES.filter((t) => t.type === 'sale');

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
          direction: trade.type,
        });
      }
    }

    return {
      purchaseValue: purchases.reduce((sum, t) => sum + t.value, 0),
      saleValue: sales.reduce((sum, t) => sum + t.value, 0),
      purchaseCount: purchases.length,
      saleCount: sales.length,
      highCount: MOCK_TRADES.filter((t) => t.signalStrength === 'High').length,
      latest: [...MOCK_TRADES]
        .sort((a, b) => b.filedAt.localeCompare(a.filedAt))
        .slice(0, LATEST_COUNT),
      topSignals: [...grouped.values()].sort((a, b) => b.total - a.total).slice(0, TOP_SIGNAL_COUNT),
    };
  }, []);

  const openScreener = (autoFocusSearch: boolean) =>
    navigation.navigate('Screener', { autoFocusSearch });

  const openDetails = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroBlock, { paddingTop: insets.top + spacing.xs }]}>
          {/* Scrolls with the page, resolving from forest green into the white
              working surface the rest of the app uses. */}
          <LinearGradient
            colors={[colors.heroTop, colors.heroBottom]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* A fixed-height fade pinned to the hero's base, so the handover to
              white always lands below the summary cards no matter how tall the
              status bar or the text above it turns out to be. */}
          <LinearGradient
            colors={[colors.heroBottom, colors.canvas]}
            style={styles.heroFade}
            pointerEvents="none"
          />

        <Animated.View entering={FadeIn.duration(400)} style={styles.brandRow}>
          <Text style={styles.brand}>Signal Desk</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(460).springify().damping(18)}
          style={styles.headerBlock}
        >
          <Text style={styles.display}>Market Pulse</Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Fictional demo data</Text>
          </View>
          <Text style={styles.subheading}>
            A prototype feed of invented insider disclosures · {formatDate(MOCK_NOW)}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(460).springify().damping(18)}>
          <SearchField mode="button" onHero onPress={() => openScreener(true)} />
        </Animated.View>

        <View style={styles.summaryRow}>
          <SummaryCard index={0} label="Filings" value={String(MOCK_TRADES.length)} caption="In this demo feed" />
          <SummaryCard
            index={1}
            label="Purchases"
            value={formatCompactCurrency(pulse.purchaseValue)}
            caption={`${pulse.purchaseCount} demo buys`}
            tint={colors.positive}
          />
          <SummaryCard
            index={2}
            label="Sales"
            value={formatCompactCurrency(pulse.saleValue)}
            caption={`${pulse.saleCount} demo sales`}
            tint={colors.negative}
          />
        </View>

        </View>

        <View style={styles.body}>
        <Animated.View entering={FadeInDown.delay(260).duration(420)} style={styles.strengthStrip}>
          <View style={styles.strengthIcon}>
            <Icon name="Bolt" size={15} color={colors.positive} strokeWidth={2} />
          </View>
          <Text style={styles.strengthText}>
            <Text style={styles.strengthCount}>{pulse.highCount} high-strength</Text> demo signals in
            the current set
          </Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top signals today</Text>
          <Text style={styles.sectionNote}>
            Invented grouping labels, ordered by demo value. Not recommendations.
          </Text>

          <View style={styles.signalRow}>
            {pulse.topSignals.map((group, i) => (
              <SignalTile key={group.signal} group={group} index={i} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadRow}>
            <Text style={styles.sectionTitle}>Latest activity</Text>
            <PressableScale
              onPress={() => openScreener(false)}
              scaleTo={0.92}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="See all demo trades in the screener"
              style={styles.seeAll}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <Icon name="ChevronRight" size={14} color={colors.ink} strokeWidth={2.4} />
            </PressableScale>
          </View>

          <View style={styles.feed}>
            {pulse.latest.map((trade, i) => (
              <TradeRow key={trade.id} trade={trade} onPress={openDetails} index={i} />
            ))}
          </View>
        </View>

        <PressableScale
          onPress={() => openScreener(false)}
          scaleTo={0.97}
          accessibilityRole="button"
          accessibilityLabel={`Browse all ${MOCK_TRADES.length} demo trades`}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Browse all {MOCK_TRADES.length} demo trades</Text>
          <Icon name="ArrowRight" size={18} color={colors.surface} strokeWidth={2.2} />
        </PressableScale>

        <Text style={styles.footNote}>
          Original mobile concept inspired by the broad insider-activity product category; all
          displayed content is fictional mock/demo data.
        </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/** A grouped signal label. Display only — it makes no claim and takes no tap. */
function SignalTile({ group, index }: { group: SignalGroup; index: number }) {
  const isCluster = group.count > 1;
  const Glyph = group.direction === 'purchase' ? RiseBars : FallBars;
  const tint =
    group.count > 1 ? colors.ink : group.direction === 'purchase' ? colors.positive : colors.negative;
  const wash =
    group.count > 1
      ? colors.sunken
      : group.direction === 'purchase'
        ? colors.positiveSoft
        : colors.negativeSoft;

  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 70).duration(420).springify().damping(18)}
      style={styles.signalTile}
    >
      <View style={[styles.signalIcon, { backgroundColor: wash }]}>
        {isCluster ? (
          <Icon name="Users" size={19} color={tint} strokeWidth={1.9} />
        ) : (
          <Glyph size={21} color={tint} />
        )}
      </View>
      {/* Fixed two-line box so values align across tiles regardless of wrap. */}
      <View style={styles.signalNameBox}>
        <Text style={styles.signalName} numberOfLines={2}>
          {group.signal}
        </Text>
      </View>
      <Text style={styles.signalTotal}>{formatCompactCurrency(group.total)}</Text>
      <Text style={styles.signalCount}>
        {group.count} demo filing{group.count === 1 ? '' : 's'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  /** Extra bottom padding gives the gradient room to finish resolving. */
  heroBlock: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl + spacing.xs, gap: spacing.lg },
  heroFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 104 },
  body: {
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  brand: { ...type.callout, color: colors.onHeroSecondary },

  headerBlock: { gap: spacing.xs, marginTop: spacing.xs },
  display: { ...type.display, color: colors.onHero },
  demoBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.heroBorder,
    backgroundColor: colors.heroSurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  demoBadgeText: { ...type.overline, color: colors.lime },
  subheading: { ...type.footnote, color: colors.onHeroSecondary, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: spacing.xs },

  strengthStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.positiveSoft,
  },
  strengthIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  strengthText: { ...type.footnote, flex: 1, color: colors.inkSecondary },
  strengthCount: { color: colors.ink, fontFamily: type.headline.fontFamily },

  section: { gap: spacing.sm },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...type.title2, color: colors.ink },
  sectionNote: { ...type.footnote, color: colors.inkTertiary, marginTop: -6 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { ...type.callout, color: colors.ink },

  signalRow: { flexDirection: 'row', gap: spacing.xs },
  signalTile: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  signalIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  signalNameBox: { height: 34, justifyContent: 'flex-start' },
  signalName: { ...type.caption, fontSize: 12.5, lineHeight: 16, color: colors.ink },
  signalTotal: { ...type.headline, fontSize: 15, color: colors.ink },
  signalCount: { ...type.caption, fontSize: 10.5, color: colors.inkTertiary },

  feed: { gap: spacing.xs },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  ctaText: { ...type.headline, color: colors.surface },

  footNote: {
    ...type.caption,
    fontSize: 11,
    lineHeight: 16,
    color: colors.inkTertiary,
    textAlign: 'center',
  },
});
