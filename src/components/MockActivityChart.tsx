import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { colors, motion, radius, spacing } from '../theme/colors';
import { type } from '../theme/type';

type Props = {
  /** Seven invented numbers from the trade record. Nothing else feeds this. */
  series: number[];
  tint: string;
};

const PLOT_HEIGHT = 132;
const BAR_WIDTH = 22;
const DAY_LABELS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

/**
 * A fictional seven-point activity chart.
 *
 * Drawn as pill-shaped bars that brighten as they rise, echoing the three
 * ascending bars in the app mark. The numbers are an invented activity index
 * stored on the trade record — not prices or volumes — so the card is labelled
 * as mock data and carries no numeric axis that could read as currency.
 */
export function MockActivityChart({ series, tint }: Props) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Mock 7-day activity</Text>
        <Text style={styles.subtitle}>Invented index — not price or volume data</Text>
      </View>

      <View
        style={styles.plot}
        accessibilityRole="image"
        accessibilityLabel={`Mock seven day activity chart. Invented index values from ${min} to ${max}. Demonstration only.`}
      >
        {[0.33, 0.66].map((ratio) => (
          <View key={ratio} style={[styles.gridLine, { bottom: PLOT_HEIGHT * ratio }]} />
        ))}

        <View style={styles.bars}>
          {series.map((value, index) => {
            // Floor at 18% so the smallest day is still a visible pill.
            const ratio = 0.18 + ((value - min) / span) * 0.82;
            return (
              <Bar
                key={index}
                heightPx={PLOT_HEIGHT * ratio}
                intensity={ratio}
                tint={tint}
                index={index}
              />
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeIn.delay(520)} style={styles.axis}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.axisLabel}>
            {label}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

function Bar({
  heightPx,
  intensity,
  tint,
  index,
}: {
  heightPx: number;
  intensity: number;
  tint: string;
  index: number;
}) {
  const grow = useSharedValue(0);

  React.useEffect(() => {
    grow.value = withDelay(120 + index * 55, withSpring(1, motion.gentle));
  }, [grow, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: grow.value }],
  }));

  return (
    <Animated.View style={[styles.barWrap, { height: heightPx }, animatedStyle]}>
      <LinearGradient
        colors={[withAlpha(tint, 0.45 + intensity * 0.35), tint]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.bar}
      />
    </Animated.View>
  );
}

/** Applies alpha to a #RRGGBB token without pulling in a colour library. */
function withAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: { gap: 3 },
  title: { ...type.title2, color: colors.ink },
  subtitle: { ...type.footnote, color: colors.inkTertiary },

  plot: { height: PLOT_HEIGHT, justifyContent: 'flex-end' },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.hairline,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: PLOT_HEIGHT,
  },
  barWrap: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    overflow: 'hidden',
    transformOrigin: 'bottom',
  },
  bar: { flex: 1, borderRadius: BAR_WIDTH / 2 },

  axis: { flexDirection: 'row', justifyContent: 'space-between' },
  axisLabel: {
    ...type.caption,
    fontSize: 11,
    color: colors.inkTertiary,
    width: BAR_WIDTH,
    textAlign: 'center',
  },
});
