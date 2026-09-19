import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { colors, radius, spacing, typography } from '../theme/colors';

type Props = {
  /** Seven invented numbers from the trade record. Nothing else feeds this chart. */
  series: number[];
  tint?: string;
};

const CHART_HEIGHT = 112;
const PAD_X = 6;
const PAD_Y = 10;
const DAY_LABELS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

/**
 * A fictional seven-point activity line.
 *
 * The numbers are an invented "activity index" stored on the trade record — they
 * are not prices, volumes or any real series — so the component is labelled as
 * mock data and deliberately carries no axis values that could read as currency.
 */
export function MockActivityChart({ series, tint = colors.chartLine }: Props) {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const innerWidth = Math.max(width - PAD_X * 2, 1);
  const innerHeight = CHART_HEIGHT - PAD_Y * 2;
  const step = series.length > 1 ? innerWidth / (series.length - 1) : 0;

  const points = series.map((value, index) => ({
    x: PAD_X + index * step,
    y: PAD_Y + innerHeight - ((value - min) / span) * innerHeight,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`
      : '';

  const last = points[points.length - 1];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Mock 7-day activity</Text>
        <Text style={styles.subtitle}>Invented index — not price or volume data</Text>
      </View>

      <View
        onLayout={onLayout}
        style={styles.canvas}
        accessibilityRole="image"
        accessibilityLabel={`Mock seven day activity chart. Invented index values from ${min} to ${max}. Demonstration only.`}
      >
        {width > 0 && (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="mockFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={tint} stopOpacity={0.28} />
                <Stop offset="1" stopColor={tint} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {[0.25, 0.5, 0.75].map((ratio) => (
              <Line
                key={ratio}
                x1={0}
                y1={PAD_Y + innerHeight * ratio}
                x2={width}
                y2={PAD_Y + innerHeight * ratio}
                stroke={colors.chartGrid}
                strokeWidth={1}
              />
            ))}

            <Path d={areaPath} fill="url(#mockFill)" />
            <Polyline
              points={polyline}
              fill="none"
              stroke={tint}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {last && (
              <>
                <Circle cx={last.x} cy={last.y} r={6} fill={tint} opacity={0.25} />
                <Circle cx={last.x} cy={last.y} r={3.5} fill={tint} />
              </>
            )}
          </Svg>
        )}
      </View>

      <View style={styles.axis}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.axisLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { gap: 2 },
  title: { ...typography.body, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 11, fontWeight: '500', color: colors.textMuted },
  canvas: { width: '100%', height: CHART_HEIGHT },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
  axisLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
});
