import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, motion, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import type { RoleFilter, ScreenerFilters, TypeFilter, ValueFilter } from '../types/trade';
import { FilterChip } from './FilterChip';
import { PressableScale } from './PressableScale';

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

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: ScreenerFilters;
  onChange: (next: ScreenerFilters) => void;
  onReset: () => void;
  /** Live count, so the confirm button states the outcome before committing. */
  resultCount: number;
};

/**
 * The screener's filter surface, presented as an iOS-style sheet.
 *
 * Moving all three filter groups off the list solves a real layout problem:
 * stacked inline they pushed the first result nearly half-way down the screen.
 * Here the list stays dense and the filters get room to breathe.
 *
 * Filters apply live as chips are tapped, so the footer button reports the
 * outcome ("Show 6 results") rather than pretending to commit a pending edit.
 */
export function FilterSheet({ visible, onClose, filters, onChange, onReset, resultCount }: Props) {
  const insets = useSafeAreaInsets();
  const [rendered, setRendered] = useState(visible);
  const [sheetHeight, setSheetHeight] = useState(0);

  const translateY = useSharedValue(1000);
  const backdrop = useSharedValue(0);

  const unmount = useCallback(() => setRendered(false), []);

  const animateOut = useCallback(() => {
    backdrop.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(sheetHeight || 1000, { duration: 220 }, (finished) => {
      if (finished) runOnJS(unmount)();
    });
  }, [backdrop, sheetHeight, translateY, unmount]);

  useEffect(() => {
    if (visible) {
      setRendered(true);
    } else if (rendered) {
      animateOut();
    }
  }, [visible, rendered, animateOut]);

  // Slide in only once the sheet's real height is known, so it never flashes.
  const onSheetLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    if (h > 0 && h !== sheetHeight) {
      setSheetHeight(h);
      if (visible) {
        translateY.value = h;
        translateY.value = withSpring(0, motion.sheet);
        backdrop.value = withTiming(1, { duration: 240 });
      }
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldDismiss = event.translationY > 110 || event.velocityY > 900;
      if (shouldDismiss) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, motion.sheet);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  if (!rendered) return null;

  const group = <T,>(
    title: string,
    options: { label: string; value: T }[],
    selected: T,
    apply: (value: T) => void,
    hint?: string,
  ) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {options.map((option) => (
          <FilterChip
            key={String(option.value)}
            label={option.label}
            selected={selected === option.value}
            onPress={() => apply(option.value)}
            size="md"
          />
        ))}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          />
        </Animated.View>

        <Animated.View
          onLayout={onSheetLayout}
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }, sheetStyle]}
        >
          <GestureDetector gesture={pan}>
            <View style={styles.grabArea}>
              <View style={styles.grabber} />
              <View style={styles.titleRow}>
                <Text style={styles.title}>Filters</Text>
                <PressableScale
                  onPress={onReset}
                  scaleTo={0.9}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Reset all filters"
                >
                  <Text style={styles.reset}>Reset</Text>
                </PressableScale>
              </View>
            </View>
          </GestureDetector>

          {group('Transaction type', TYPE_OPTIONS, filters.type, (value) =>
            onChange({ ...filters, type: value }),
          )}

          {group(
            'Insider role',
            ROLE_OPTIONS,
            filters.role,
            (value) => onChange({ ...filters, role: value }),
            'Officer-level demo filings appear under "All roles".',
          )}

          {group('Value threshold', VALUE_OPTIONS, filters.minValue, (value) =>
            onChange({ ...filters, minValue: value }),
          )}

          <PressableScale
            onPress={onClose}
            scaleTo={0.98}
            accessibilityRole="button"
            accessibilityLabel={`Show ${resultCount} results`}
            style={styles.confirm}
          >
            <Text style={styles.confirmText}>
              Show {resultCount} result{resultCount === 1 ? '' : 's'}
            </Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.scrim,
  },

  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  grabArea: { paddingTop: spacing.sm, gap: spacing.md },
  grabber: {
    alignSelf: 'center',
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.hairlineStrong,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...type.title1, fontSize: 24, color: colors.ink },
  reset: { ...type.callout, color: colors.inkSecondary },

  group: { gap: spacing.sm },
  groupTitle: { ...type.headline, color: colors.ink },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  hint: { ...type.footnote, color: colors.inkTertiary },

  confirm: {
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { ...type.headline, color: '#FFFFFF' },
});
