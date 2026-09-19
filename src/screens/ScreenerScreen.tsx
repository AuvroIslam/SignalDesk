import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChip } from '../components/FilterChip';
import { SearchField } from '../components/SearchField';
import { TradeCard } from '../components/TradeCard';
import { MOCK_TRADES } from '../data/mockTrades';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { HIT_TARGET, colors, radius, spacing, typography } from '../theme/colors';
import type {
  InsiderTrade,
  RoleFilter,
  ScreenerFilters,
  TypeFilter,
  ValueFilter,
} from '../types/trade';
import { DEFAULT_FILTERS, filterTrades, isNarrowed } from '../utils/filterTrades';

type Props = NativeStackScreenProps<RootStackParamList, 'Screener'>;

const TYPE_OPTIONS: { label: string; value: TypeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Purchases', value: 'purchase' },
  { label: 'Sales', value: 'sale' },
];

const ROLE_OPTIONS: { label: string; value: RoleFilter }[] = [
  { label: 'All roles', value: 'All roles' },
  { label: 'CEO', value: 'CEO' },
  { label: 'CFO', value: 'CFO' },
  { label: 'Director', value: 'Director' },
];

const VALUE_OPTIONS: { label: string; value: ValueFilter }[] = [
  { label: 'Any', value: 0 },
  { label: '$100K+', value: 100_000 },
  { label: '$500K+', value: 500_000 },
  { label: '$1M+', value: 1_000_000 },
];

export function ScreenerScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const autoFocusSearch = route.params?.autoFocusSearch ?? false;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ScreenerFilters>(DEFAULT_FILTERS);

  const isFiltered = isNarrowed(query, filters);

  /**
   * Search and all three filter groups are applied together against the local
   * array. Nothing is fetched; the whole screener is a pure derivation of state.
   */
  const results = useMemo(() => filterTrades(MOCK_TRADES, query, filters), [query, filters]);

  const clearAll = () => {
    setQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  const openDetails = (trade: InsiderTrade) =>
    navigation.navigate('TradeDetails', { tradeId: trade.id });

  const renderFilterRow = <T,>(
    title: string,
    options: { label: string; value: T }[],
    selected: T,
    onSelect: (value: T) => void,
    hint?: string,
  ) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {options.map((option) => (
          <FilterChip
            key={String(option.value)}
            label={option.label}
            selected={selected === option.value}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </View>
      {hint ? <Text style={styles.filterHint}>{hint}</Text> : null}
    </View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back to Market Pulse"
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.heading}>Latest Trades</Text>
          <Text style={styles.subheading}>Search and filter the fictional demo feed</Text>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TradeCard trade={item} onPress={openDetails} />}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          <View style={styles.controls}>
            <SearchField
              mode="input"
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
              autoFocus={autoFocusSearch}
            />

            {renderFilterRow('TRANSACTION TYPE', TYPE_OPTIONS, filters.type, (value) =>
              setFilters((prev) => ({ ...prev, type: value })),
            )}

            {renderFilterRow(
              'INSIDER ROLE',
              ROLE_OPTIONS,
              filters.role,
              (value) => setFilters((prev) => ({ ...prev, role: value })),
              'Officer-level demo filings appear under "All roles".',
            )}

            {renderFilterRow('VALUE THRESHOLD', VALUE_OPTIONS, filters.minValue, (value) =>
              setFilters((prev) => ({ ...prev, minValue: value })),
            )}

            <View style={styles.resultBar}>
              <Text style={styles.resultCount}>
                {results.length} result{results.length === 1 ? '' : 's'}
              </Text>
              {isFiltered && (
                <Pressable
                  onPress={clearAll}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search and all filters"
                  hitSlop={8}
                  style={({ pressed }) => [styles.clearLink, pressed && styles.clearLinkPressed]}
                >
                  <Ionicons name="refresh" size={13} color={colors.accent} />
                  <Text style={styles.clearLinkText}>Clear filters</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search" size={22} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No fictional demo trades match those filters.</Text>
            <Text style={styles.emptyBody}>
              Try a shorter ticker, a wider value threshold, or reset everything and start again.
            </Text>
            <Pressable
              onPress={clearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear search and all filters"
              style={({ pressed }) => [styles.emptyButton, pressed && styles.emptyButtonPressed]}
            >
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
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
  heading: { ...typography.title, color: colors.textPrimary },
  subheading: { fontSize: 12, fontWeight: '500', color: colors.textMuted },

  listContent: { paddingHorizontal: spacing.md },
  controls: { gap: spacing.md, paddingBottom: spacing.md },

  filterGroup: { gap: spacing.xs },
  filterTitle: { ...typography.micro, color: colors.textMuted, letterSpacing: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  filterHint: { fontSize: 11, fontWeight: '500', color: colors.textMuted },

  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultCount: { ...typography.body, fontWeight: '700', color: colors.textPrimary },
  clearLink: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  clearLinkPressed: { opacity: 0.6 },
  clearLinkText: { ...typography.label, color: colors.accent },

  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLift,
  },
  emptyTitle: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
  emptyButton: {
    marginTop: spacing.xs,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  emptyButtonPressed: { opacity: 0.7 },
  emptyButtonText: { ...typography.label, color: colors.accent },
});
