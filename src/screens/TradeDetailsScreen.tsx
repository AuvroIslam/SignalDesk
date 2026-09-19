import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DirectionTag } from '../components/DirectionTag';
import { Fall, Rise } from '../components/icons/BrandIcons';
import { Icon } from '../components/icons/Icon';
import { MockActivityChart } from '../components/MockActivityChart';
import { PressableScale } from '../components/PressableScale';
import { SignalBadge } from '../components/SignalBadge';
import { findTradeById } from '../data/mockTrades';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { HIT_TARGET, colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import { REQUIRED_DISCLAIMER, explainTrade } from '../utils/education';
import {
  formatCompactCurrency,
  formatDate,
  formatDateTime,
  formatFullCurrency,
  formatPrice,
  formatShares,
  tradeTypeLabel,
} from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'TradeDetails'>;

export function TradeDetailsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const trade = findTradeById(route.params.tradeId);
  useStatusBarStyle('dark');

  const backButton = (
    <PressableScale
      onPress={() => navigation.goBack()}
      scaleTo={0.9}
      accessibilityRole="button"
      accessibilityLabel="Go back to the previous screen"
      hitSlop={8}
      style={styles.iconButton}
    >
      <Icon name="ChevronLeft" size={20} color={colors.ink} strokeWidth={2.2} />
    </PressableScale>
  );

  // Defensive: the id always resolves from local data, but a missing record
  // should degrade to a readable screen rather than a crash.
  if (!trade) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top + spacing.md }]}>
        {backButton}
        <Text style={styles.missingText}>That demo filing is no longer in the local set.</Text>
      </View>
    );
  }

  const isPurchase = trade.type === 'purchase';
  const tint = isPurchase ? colors.positive : colors.negative;
  const tintSoft = isPurchase ? colors.positiveSoft : colors.negativeSoft;

  const rows: { label: string; value: string }[] = [
    { label: 'Insider', value: `${trade.insider} · ${trade.role}` },
    { label: 'Transaction', value: `${tradeTypeLabel(trade.type)} · Code ${trade.transactionCode}` },
    { label: 'Shares', value: formatShares(trade.shares) },
    { label: 'Price per share', value: `${formatPrice(trade.pricePerShare)} (demo)` },
    { label: 'Total value', value: `${formatFullCurrency(trade.value)} (demo)` },
    { label: 'Transaction date', value: formatDate(trade.transactionDate) },
    { label: 'Filed date', value: formatDateTime(trade.filedAt) },
    { label: 'Signal strength', value: `${trade.signalStrength} · ${trade.signal}` },
  ];

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>{backButton}</View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(420).springify().damping(18)} style={styles.titleBlock}>
          <Text style={styles.company}>{trade.company}</Text>
          <Text style={styles.identifiers}>
            {trade.ticker} · {trade.sector}
          </Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Fictional demo data</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(60).duration(420).springify().damping(18)}
          style={[styles.signalCard, { backgroundColor: tintSoft }]}
        >
          <View style={styles.signalTop}>
            <View style={[styles.signalIcon, { backgroundColor: tint }]}>
              {isPurchase ? <Rise size={21} color="#FFFFFF" /> : <Fall size={21} color="#FFFFFF" />}
            </View>
            <View style={styles.signalTextBlock}>
              <Text style={[styles.signalName, { color: tint }]} numberOfLines={2}>
                {trade.signal}
              </Text>
              <Text style={styles.signalValue}>
                {formatCompactCurrency(trade.value)} fictional demo insider{' '}
                {isPurchase ? 'buy' : 'sale'}
              </Text>
            </View>
            <SignalBadge strength={trade.signalStrength} />
          </View>

          <View style={styles.signalFooter}>
            <DirectionTag direction={trade.type} variant="pill" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(420)} style={styles.specCard}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.specRow, index < rows.length - 1 && styles.specDivider]}>
              <Text style={styles.specLabel}>{row.label}</Text>
              <Text style={styles.specValue} numberOfLines={2}>
                {row.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(420)}>
          <MockActivityChart series={trade.activitySeries} tint={tint} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(420)} style={styles.educationCard}>
          <View style={styles.educationHead}>
            <Icon name="Info" size={18} color={colors.ink} strokeWidth={1.9} />
            <Text style={styles.educationTitle}>Why this matters</Text>
          </View>
          <Text style={styles.educationBody}>{explainTrade(trade)}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(420)} style={styles.disclaimerCard}>
          <Icon name="Warning" size={17} color={colors.inkTertiary} strokeWidth={1.9} />
          <Text style={styles.disclaimerText}>{REQUIRED_DISCLAIMER}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xs },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },

  missing: { alignItems: 'flex-start', gap: spacing.md, paddingHorizontal: spacing.lg },
  missingText: { ...type.body, color: colors.inkSecondary },

  iconButton: {
    width: HIT_TARGET,
    height: HIT_TARGET,
    borderRadius: HIT_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },

  titleBlock: { gap: spacing.xxs },
  company: { ...type.title1, color: colors.ink },
  identifiers: { ...type.footnote, color: colors.inkSecondary },
  demoBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.sunken,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  demoBadgeText: { ...type.overline, color: colors.inkSecondary },

  signalCard: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  signalTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  signalIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalTextBlock: { flex: 1, minWidth: 0, gap: 2 },
  signalName: { ...type.title2, fontSize: 17 },
  signalValue: { ...type.footnote, color: colors.ink },
  signalFooter: { flexDirection: 'row' },

  specCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm + 1,
  },
  specDivider: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  specLabel: { ...type.body, fontSize: 14, color: colors.inkSecondary, flexShrink: 0 },
  specValue: {
    flex: 1,
    minWidth: 0,
    ...type.headline,
    fontSize: 14.5,
    color: colors.ink,
    textAlign: 'right',
  },

  educationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: spacing.md,
    gap: spacing.xs,
  },
  educationHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  educationTitle: { ...type.title2, fontSize: 17, color: colors.ink },
  educationBody: { ...type.body, fontSize: 14, color: colors.inkSecondary },

  disclaimerCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.sunken,
  },
  disclaimerText: {
    flex: 1,
    minWidth: 0,
    ...type.caption,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.inkTertiary,
  },
});
