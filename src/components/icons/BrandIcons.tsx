import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Brand icons, drawn for this app rather than taken from a general icon set.
 *
 * They speak the app mark's language: rounded pills that step up or down, and
 * dots that gather. A stock trending-arrow reads as "any finance app"; an
 * ascending stack of pills reads as *this* one, and ties the signal tiles, the
 * activity chart and the launcher icon into a single family.
 */

type Props = {
  size?: number;
  color?: string;
};

/** Rising activity: three pills stepping up, straight from the app mark. */
export function RiseBars({ size = 20, color = '#0B100D' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={14} width={4.5} height={7} rx={2.25} fill={color} opacity={0.45} />
      <Rect x={9.75} y={9} width={4.5} height={12} rx={2.25} fill={color} opacity={0.72} />
      <Rect x={16} y={3} width={4.5} height={18} rx={2.25} fill={color} />
    </Svg>
  );
}

/** Falling activity: the same stack, stepping down. */
export function FallBars({ size = 20, color = '#0B100D' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={3} width={4.5} height={18} rx={2.25} fill={color} />
      <Rect x={9.75} y={9} width={4.5} height={12} rx={2.25} fill={color} opacity={0.72} />
      <Rect x={16} y={14} width={4.5} height={7} rx={2.25} fill={color} opacity={0.45} />
    </Svg>
  );
}

/** Several filings grouped under one label. */
export function ClusterDots({ size = 20, color = '#0B100D' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={7.8} cy={8.2} r={4.1} fill={color} opacity={0.45} />
      <Circle cx={16.4} cy={8.2} r={4.1} fill={color} opacity={0.7} />
      <Circle cx={12.1} cy={16.2} r={4.1} fill={color} />
    </Svg>
  );
}

/** Direction up. Heavier and rounder than a general-purpose arrow. */
export function Rise({ size = 14, color = '#0B100D' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19.5V5.5M12 5.5 5.6 11.9M12 5.5l6.4 6.4"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Direction down. */
export function Fall({ size = 14, color = '#0B100D' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4.5v14M12 18.5l6.4-6.4M12 18.5 5.6 12.1"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
