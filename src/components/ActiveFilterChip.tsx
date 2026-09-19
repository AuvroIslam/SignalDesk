import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import { Icon } from './icons/Icon';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onRemove: () => void;
};

/**
 * A filter that is currently narrowing the feed, shown by name.
 *
 * Without these, a filter set inside the sheet is invisible on the list: the
 * count drops and the only explanation is a numeric badge. Naming each active
 * constraint — and letting it be removed in one tap — is what stops the screen
 * feeling like it lost the user's data.
 */
export function ActiveFilterChip({ label, onRemove }: Props) {
  return (
    <PressableScale
      onPress={onRemove}
      scaleTo={0.92}
      accessibilityRole="button"
      accessibilityLabel={`${label} filter active. Tap to remove.`}
      hitSlop={6}
      style={styles.chip}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.close}>
        <Icon name="Close" size={11} color={colors.surface} strokeWidth={3} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 32,
    paddingLeft: spacing.sm,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  label: { ...type.caption, color: colors.surface },
  close: {
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
