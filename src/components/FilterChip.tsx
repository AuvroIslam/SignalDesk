import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Larger target for the filter sheet, where chips are the primary control. */
  size?: 'sm' | 'md';
};

/**
 * Selection is carried by fill inversion — solid ink, white label — rather
 * than a tint. It survives a screenshot, a projector and greyscale, and it
 * matches the way iOS marks a committed choice.
 */
export function FilterChip({ label, selected, onPress, size = 'sm' }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={6}
      style={[
        styles.chip,
        size === 'md' && styles.chipMd,
        selected ? styles.chipSelected : styles.chipIdle,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipMd: { minHeight: 46, paddingHorizontal: spacing.lg },
  chipIdle: { backgroundColor: colors.sunken, borderColor: 'transparent' },
  chipSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  label: { ...type.callout },
  labelIdle: { color: colors.inkSecondary },
  labelSelected: { color: '#FFFFFF' },
});
