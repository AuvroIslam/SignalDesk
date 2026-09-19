import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { HIT_TARGET, colors, radius, spacing, typography } from '../theme/colors';

type EditableProps = {
  mode: 'input';
  value: string;
  onChangeText: (next: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
  placeholder?: string;
};

type ButtonProps = {
  mode: 'button';
  placeholder?: string;
  onPress: () => void;
};

type Props = EditableProps | ButtonProps;

const DEFAULT_PLACEHOLDER = 'Search ticker or company';

/**
 * One search affordance in two modes, so Home and the Screener stay visually
 * identical: Home renders a button that navigates and focuses the real field,
 * the Screener renders the live input.
 */
export function SearchField(props: Props) {
  const placeholder = props.placeholder ?? DEFAULT_PLACEHOLDER;

  if (props.mode === 'button') {
    return (
      <Pressable
        onPress={props.onPress}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        accessibilityHint="Opens the screener with the search field focused"
        style={({ pressed }) => [styles.shell, pressed && styles.shellPressed]}
      >
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <Text style={styles.placeholder}>{placeholder}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.shell}>
      <Ionicons name="search" size={17} color={colors.textMuted} />
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoFocus={props.autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {props.value.length > 0 && (
        <Pressable
          onPress={props.onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search text"
          hitSlop={10}
          style={styles.clear}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: HIT_TARGET,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  shellPressed: { backgroundColor: colors.surfaceAlt, borderColor: colors.borderStrong },
  placeholder: { ...typography.body, color: colors.textMuted },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    ...typography.body,
    paddingVertical: spacing.xs,
  },
  clear: { padding: 2 },
});
