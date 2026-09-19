import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing } from '../theme/colors';
import { type } from '../theme/type';

const LOGO_SIZE = 132;

type Props = {
  onDone: () => void;
};

/**
 * The launch sequence.
 *
 * The native splash shows the bare green ground and nothing else, so the first
 * thing the user ever sees move is the mark arriving. It springs in with a
 * slight overshoot and a counter-rotating wobble, the wordmark rises beneath
 * it, and the whole cover lifts away to reveal Market Pulse behind.
 */
export function LaunchScreen({ onDone }: Props) {
  const scale = useSharedValue(0.6);
  const markFade = useSharedValue(0);
  const tilt = useSharedValue(0);
  const wordmark = useSharedValue(0);
  const cover = useSharedValue(1);
  const lift = useSharedValue(1);

  useEffect(() => {
    // The mark arrives rather than being already there: the native splash held
    // only the green ground, so this is the first motion on screen.
    markFade.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.quad) });
    scale.value = withSequence(
      withTiming(1.1, { duration: 260, easing: Easing.out(Easing.back(2.2)) }),
      withSpring(1, { damping: 6, stiffness: 200, mass: 0.65 }),
    );
    tilt.value = withDelay(
      180,
      withSequence(
        withTiming(-5, { duration: 120 }),
        withTiming(4, { duration: 120 }),
        withSpring(0, { damping: 5, stiffness: 220 }),
      ),
    );

    wordmark.value = withDelay(
      300,
      withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }),
    );

    // Lift and fade the whole cover away, the way an app window opens.
    lift.value = withDelay(1520, withTiming(1.08, { duration: 360, easing: Easing.in(Easing.cubic) }));
    cover.value = withDelay(
      1520,
      withTiming(0, { duration: 360, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
  }, [scale, markFade, tilt, wordmark, cover, lift, onDone]);

  const coverStyle = useAnimatedStyle(() => ({
    opacity: cover.value,
    transform: [{ scale: lift.value }],
  }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: markFade.value,
    transform: [{ scale: scale.value }, { rotate: `${tilt.value}deg` }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmark.value,
    transform: [{ translateY: (1 - wordmark.value) * 18 }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.cover, coverStyle]} pointerEvents="none">
      <LinearGradient
        colors={[colors.heroTop, colors.heroBottom]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.centre}>
        <Animated.View style={markStyle}>
          <Image source={require('../../assets/brand-mark.png')} style={styles.mark} />
        </Animated.View>

        <Animated.View style={wordmarkStyle}>
          <Text style={styles.title}>Market Pulse</Text>
          <Text style={styles.subtitle}>Fictional demo data</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: { zIndex: 10, backgroundColor: colors.heroTop },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  mark: { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: 30 },
  title: { ...type.display, fontSize: 32, color: colors.onHero, textAlign: 'center' },
  subtitle: {
    ...type.overline,
    color: colors.lime,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
