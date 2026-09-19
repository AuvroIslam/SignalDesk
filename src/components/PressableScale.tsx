import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** How far the surface sinks under the finger. Large cards move less. */
  scaleTo?: number;
  dimTo?: number;
};

/**
 * The app's single press behaviour.
 *
 * iOS gives almost every tappable surface a small, springy recess rather than
 * a flat opacity flash. Doing it once here keeps that feel consistent across
 * cards, chips, rows and buttons, and keeps the timing in one place.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  dimTo = 1,
  ...rest
}: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
    opacity: 1 - pressed.value * (1 - dimTo),
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        pressed.value = withSpring(1, motion.snappy);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withSpring(0, motion.snappy);
        rest.onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
