import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { HIT_TARGET, colors, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';
import { Icon } from './icons/Icon';
import { PressableScale } from './PressableScale';

type EditableProps = {
  mode: 'input';
  value: string;
  onChangeText: (next: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
};

type ButtonProps = {
  mode: 'button';
  onPress: () => void;
  /** Dark-green hero styling for the home screen. */
  onHero?: boolean;
};

type Props = (EditableProps | ButtonProps) & { placeholder?: string };

const DEFAULT_PLACEHOLDER = 'Search ticker or company';

/**
 * One search affordance in two modes.
 *
 * Home renders the button, which navigates and focuses the real field; the
 * screener renders the live input. Sharing the component means the element the
 * user tapped is visually the element they land on.
 */
export function SearchField(props: Props) {
  const placeholder = props.placeholder ?? DEFAULT_PLACEHOLDER;

  if (props.mode === 'button') {
    const onHero = props.onHero ?? false;
    return (
      <PressableScale
        onPress={props.onPress}
        scaleTo={0.98}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        accessibilityHint="Opens the screener with the search field focused"
        style={[styles.shell, onHero ? styles.shellHero : styles.shellLight]}
      >
        <Icon name="Search" size={19} color={onHero ? colors.onHeroTertiary : colors.inkTertiary} />
        <Text
          style={[styles.placeholder, { color: onHero ? colors.onHeroSecondary : colors.inkTertiary }]}
        >
          {placeholder}
        </Text>
        <Icon
          name="ChevronRight"
          size={17}
          color={onHero ? colors.onHeroTertiary : colors.inkTertiary}
          strokeWidth={2}
        />
      </PressableScale>
    );
  }

  return (
    <View style={[styles.shell, styles.shellLight]}>
      <Icon name="Search" size={19} color={colors.inkTertiary} />
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkTertiary}
        autoFocus={props.autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={colors.ink}
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {props.value.length > 0 && (
        <PressableScale
          onPress={props.onClear}
          scaleTo={0.85}
          accessibilityRole="button"
          accessibilityLabel="Clear search text"
          hitSlop={12}
          style={styles.clear}
        >
          <Icon name="ClearCircle" size={19} color={colors.inkTertiary} />
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  shellLight: { backgroundColor: colors.surface, borderColor: colors.hairline },
  shellHero: { backgroundColor: colors.heroSurface, borderColor: colors.heroBorder },
  placeholder: { ...type.body, flex: 1 },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    ...type.body,
    paddingVertical: spacing.sm,
  },
  clear: { padding: 2 },
});
