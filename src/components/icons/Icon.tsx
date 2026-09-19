/**
 * Icon set generated from Heroicons v2.2.0 (MIT).
 *
 * The SVG path data is copied verbatim from the `heroicons` package at build
 * time rather than hand-written, and rendered through react-native-svg so the
 * app ships no icon font and no platform default glyphs.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export type IconName =
  | 'Search'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'Sliders'
  | 'Sort'
  | 'ArrowRight'
  | 'Reset'
  | 'Bolt'
  | 'Info'
  | 'Warning'
  | 'Users'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Close'
  | 'TrendUp'
  | 'TrendDown'
  | 'ClearCircle'
  | 'Logo';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Outline weight. 1.5 matches Heroicons' own default; 2 reads bolder. */
  strokeWidth?: number;
};

type Shape = {
  viewBox: string;
  kind: 'outline' | 'solid';
  d: string[];
};

const SHAPES: Record<IconName, Shape> = {
  Search: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
    ],
  },
  ChevronLeft: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M15.75 19.5 8.25 12l7.5-7.5',
    ],
  },
  ChevronRight: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'm8.25 4.5 7.5 7.5-7.5 7.5',
    ],
  },
  Sliders: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75',
    ],
  },
  Sort: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5',
    ],
  },
  ArrowRight: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
    ],
  },
  Reset: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99',
    ],
  },
  Bolt: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
    ],
  },
  Info: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
    ],
  },
  Warning: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
    ],
  },
  Users: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
    ],
  },
  ArrowUp: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18',
    ],
  },
  ArrowDown: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3',
    ],
  },
  Close: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M6 18 18 6M6 6l12 12',
    ],
  },
  TrendUp: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    ],
  },
  TrendDown: {
    viewBox: '0 0 24 24',
    kind: 'outline',
    d: [
      'M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181',
    ],
  },
  ClearCircle: {
    viewBox: '0 0 20 20',
    kind: 'solid',
    d: [
      'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z',
    ],
  },
  /** Brand mark: three ascending rounded bars, traced from the app icon. */
  Logo: {
    viewBox: '0 0 24 24',
    kind: 'solid',
    d: [
      'M3.5 14.5a2.5 2.5 0 0 1 5 0v4a2.5 2.5 0 0 1-5 0v-4Z',
      'M9.5 9.5a2.5 2.5 0 0 1 5 0v9a2.5 2.5 0 0 1-5 0v-9Z',
      'M15.5 4.5a2.5 2.5 0 0 1 5 0v14a2.5 2.5 0 0 1-5 0v-14Z',
    ],
  },
};

export function Icon({ name, size = 22, color = '#0B0F0D', strokeWidth = 1.7 }: Props) {
  const shape = SHAPES[name];
  return (
    <Svg width={size} height={size} viewBox={shape.viewBox} fill="none">
      {shape.d.map((d, i) =>
        shape.kind === 'outline' ? (
          <Path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <Path key={i} d={d} fill={color} fillRule="evenodd" clipRule="evenodd" />
        ),
      )}
    </Svg>
  );
}
