import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveFilterChip } from '../components/ActiveFilterChip';
import { FilterChip } from '../components/FilterChip';
import { FilterSheet } from '../components/FilterSheet';
import { Icon } from '../components/icons/Icon';
import { PressableScale } from '../components/PressableScale';
import { SearchField } from '../components/SearchField';
import { TradeRow } from '../components/TradeRow';
import { MOCK_TRADES } from '../data/mockTrades';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { HIT_TARGET, colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import type { InsiderTrade, ScreenerFilters, SortKey, TypeFilter } from '../types/trade';
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  filterTrades,
  hiddenFilterCount,
  isNarrowed,
} from '../utils/filterTrades';

type Props = NativeStackScreenProps<RootStackParamList, 'Screener'>;

/** Transaction type stays inline: it is the filter people reach for first. */
const QUICK_TYPES: { label: string; value: TypeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Purchases', value: 'purchase' },
  { label: 'Sales', value: 'sale' },
];

const SORT_LABEL: Record<SortKey, string> = {
  recent: 'Newest',
  value: 'Largest',
};

/** Human-readable name for an active value threshold. */
const VALUE_LABEL: Record<number, string> = {
  100000: '$100K+',
  500000: '$500K+',
  1000000: '$1M+',
};

export function ScreenerScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const autoFocusSearch = route.params?.autoFocusSearch ?? false;
  useStatusBarStyle('dark');

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ScreenerFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>(DEFAULT_SORT);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(
    () => filterTrades(MOCK_TRADES, query, filters, sort),
    [query, filters, sort],
  );

  const narrowed = isNarrowed(query, filters);
  const hiddenCount = hiddenFilterCount(filters);

  const clearAll = () => {
    setQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  const openDetails = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xs }]}>
      <View style={styles.header}>
        <PressableScale
          onPress={() => navigation.goBack()}
          scaleTo={0.9}
          accessibilityRole="button"
          accessibilityLabel="Go back to Market Pulse"
          hitSlop={8}
          style={styles.iconButton}
        >
          <Icon name="ChevronLeft" size={20} color={colors.ink} strokeWidth={2.2} />
        </PressableScale>

        <View style={styles.headerText}>
          <Text style={styles.title}>Latest Trades</Text>
          <Text style={styles.subtitle}>Search and filter the fictional demo feed</Text>
        </View>

        <View style={styles.iconButtonGhost} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TradeRow trade={item} onPress={openDetails} detailed index={index} />
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.xxl }]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        ListHeaderComponent={
          <View style={styles.controls}>
            <SearchField
              mode="input"
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
              autoFocus={autoFocusSearch}
            />

            <View style={styles.quickRow}>
              {QUICK_TYPES.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={filters.type === option.value}
                  onPress={() => setFilters((prev) => ({ ...prev, type: option.value }))}
                />
              ))}

              <PressableScale
                onPress={() => setSheetOpen(true)}
                scaleTo={0.94}
                accessibilityRole="button"
                accessibilityLabel={
                  hiddenCount > 0
                    ? `Open filters, ${hiddenCount} active`
                    : 'Open filters'
                }
                style={[styles.filterButton, hiddenCount > 0 && styles.filterButtonActive]}
              >
                <Icon
                  name="Sliders"
                  size={16}
                  color={hiddenCount > 0 ? '#FFFFFF' : colors.inkSecondary}
                  strokeWidth={2}
                />
                <Text
                  style={[styles.filterButtonText, hiddenCount > 0 && styles.filterButtonTextActive]}
                >
                  Filter
                </Text>
                {hiddenCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{hiddenCount}</Text>
                  </View>
                )}
              </PressableScale>
            </View>

            {hiddenCount > 0 && (
              <View style={styles.activeRow}>
                {filters.role !== DEFAULT_FILTERS.role && (
                  <ActiveFilterChip
                    label={filters.role}
                    onRemove={() => setFilters((prev) => ({ ...prev, role: DEFAULT_FILTERS.role }))}
                  />
                )}
                {filters.minValue !== DEFAULT_FILTERS.minValue && (
                  <ActiveFilterChip
                    label={VALUE_LABEL[filters.minValue]}
                    onRemove={() =>
                      setFilters((prev) => ({ ...prev, minValue: DEFAULT_FILTERS.minValue }))
                    }
                  />
                )}
              </View>
            )}

            <View style={styles.resultBar}>
              <Animated.Text key={results.length} entering={FadeIn.duration(200)} style={styles.resultCount}>
                {results.length} result{results.length === 1 ? '' : 's'}
              </Animated.Text>

              <View style={styles.resultActions}>
                {narrowed && (
                  <PressableScale
                    onPress={clearAll}
                    scaleTo={0.92}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search and all filters"
                    style={styles.textAction}
                  >
                    <Icon name="Reset" size={14} color={colors.inkSecondary} strokeWidth={2} />
                    <Text style={styles.textActionLabel}>Clear</Text>
                  </PressableScale>
                )}

                <PressableScale
                  onPress={() => setSort((prev) => (prev === 'recent' ? 'value' : 'recent'))}
                  scaleTo={0.92}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Sorted by ${SORT_LABEL[sort]}. Tap to change.`}
                  style={styles.textAction}
                >
                  <Icon name="Sort" size={14} color={colors.inkSecondary} strokeWidth={2} />
                  <Text style={styles.textActionLabel}>Sort: {SORT_LABEL[sort]}</Text>
                </PressableScale>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.duration(360).springify().damping(20)} style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Icon name="Search" size={24} color={colors.inkTertiary} strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>No fictional demo trades match those filters.</Text>
            <Text style={styles.emptyBody}>
              Try a shorter ticker, a wider value threshold, or reset everything and start again.
            </Text>
            <PressableScale
              onPress={clearAll}
              scaleTo={0.95}
              accessibilityRole="button"
              accessibilityLabel="Clear search and all filters"
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </PressableScale>
          </Animated.View>
        }
      />

      <FilterSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        resultCount={results.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
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
  /** Balances the back button so the title stays optically centred. */
  iconButtonGhost: { width: HIT_TARGET, height: HIT_TARGET },
  headerText: { flex: 1, minWidth: 0, alignItems: 'center', gap: 1 },
  title: { ...type.title2, color: colors.ink },
  subtitle: { ...type.caption, fontSize: 11.5, color: colors.inkTertiary },

  listContent: { paddingHorizontal: spacing.lg },
  controls: { gap: spacing.sm, paddingBottom: spacing.sm },

  quickRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  activeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.sunken,
    marginLeft: 'auto',
  },
  filterButtonActive: { backgroundColor: colors.ink },
  filterButtonText: { ...type.callout, color: colors.inkSecondary },
  filterButtonTextActive: { color: '#FFFFFF' },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lime,
  },
  badgeText: { ...type.caption, fontSize: 10.5, color: colors.ink },

  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  resultCount: { ...type.headline, color: colors.ink },
  resultActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  textAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  textActionLabel: { ...type.callout, color: colors.inkSecondary },

  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sunken,
  },
  emptyTitle: { ...type.title2, fontSize: 17, color: colors.ink, textAlign: 'center' },
  emptyBody: { ...type.footnote, color: colors.inkTertiary, textAlign: 'center' },
  emptyButton: {
    marginTop: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  emptyButtonText: { ...type.callout, color: '#FFFFFF' },
});
