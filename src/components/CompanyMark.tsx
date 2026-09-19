import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '../theme/colors';

type Props = {
  ticker: string;
  size?: number;
  /** Renders light-on-dark for the green hero, dark-on-light elsewhere. */
  onHero?: boolean;
};

/**
 * A distinct monochrome mark per fictional company.
 *
 * Each one is an invented geometric glyph loosely themed to that company's
 * invented sector — a grid for grid infrastructure, an orbit for mobility, and
 * so on. Marks beat letter monograms in a dense feed because shape is
 * recognisable in peripheral vision in a way a letterform is not, and staying
 * monochrome keeps them from competing with the purchase/sale colours.
 *
 * Every glyph is drawn here from primitives; none is a real company's logo.
 */
export function CompanyMark({ ticker, size = 40, onHero = false }: Props) {
  const bg = onHero ? 'rgba(255,255,255,0.12)' : colors.ink;
  const fg = onHero ? colors.onHero : colors.surface;
  const S = 24;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${S} ${S}`}>
      <Circle cx={S / 2} cy={S / 2} r={S / 2} fill={bg} />
      <G>{glyph(ticker, fg)}</G>
    </Svg>
  );
}

function glyph(ticker: string, fg: string) {
  const stroke = { stroke: fg, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' as const };

  switch (ticker) {
    // Grid Infrastructure — a lattice.
    case 'NOVA':
      return (
        <>
          <Path d="M8 7v10M12 7v10M16 7v10" {...stroke} />
          <Path d="M7 10h10M7 14h10" {...stroke} strokeWidth={1.2} />
        </>
      );

    // Health Diagnostics — a clinical cross.
    case 'ELIO':
      return (
        <>
          <Rect x={10.6} y={6.5} width={2.8} height={11} rx={1.4} fill={fg} />
          <Rect x={6.5} y={10.6} width={11} height={2.8} rx={1.4} fill={fg} />
        </>
      );

    // Renewable Energy — a bolt.
    case 'VOLT':
      return <Path d="M13.4 5.5 8 12.8h3.4L10.6 18.5 16 11.2h-3.4l.8-5.7Z" fill={fg} />;

    // Cloud Software — a cloud silhouette.
    case 'AURI':
      return (
        <Path
          d="M8.2 16.5h7.9a3 3 0 0 0 .3-6 4.2 4.2 0 0 0-8-1.2 2.9 2.9 0 0 0-.2 7.2Z"
          fill={fg}
        />
      );

    // Industrial Robotics — a hex nut.
    case 'MESA':
      return (
        <>
          <Path d="M12 5.2 18 8.6v6.8L12 18.8 6 15.4V8.6l6-3.4Z" {...stroke} />
          <Circle cx={12} cy={12} r={2.4} fill={fg} />
        </>
      );

    // Retail Platforms — a shopping tote.
    case 'LYRA':
      return (
        <>
          <Path d="M7 9.5h10l-.9 8.2a1 1 0 0 1-1 .8H8.9a1 1 0 0 1-1-.8L7 9.5Z" {...stroke} />
          <Path d="M9.8 9.5V8a2.2 2.2 0 0 1 4.4 0v1.5" {...stroke} />
        </>
      );

    // Mobility — an orbit.
    case 'ORBT':
      return (
        <>
          <Circle cx={12} cy={12} r={3} fill={fg} />
          <Path d="M12 5.4c4.6 0 8.2 1.9 8.2 4.2S16.6 13.8 12 13.8 3.8 11.9 3.8 9.6 7.4 5.4 12 5.4Z" {...stroke} strokeWidth={1.3} />
        </>
      );

    // Advanced Materials — a faceted crystal.
    case 'SOLA':
      return (
        <>
          <Path d="M12 5.4 18 12l-6 6.6L6 12l6-6.6Z" {...stroke} />
          <Path d="M6 12h12M12 5.4v13.2" {...stroke} strokeWidth={1.1} />
        </>
      );

    // Biotech Research — a helix.
    case 'KIRA':
      return (
        <>
          <Path d="M8.6 5.6c0 4.3 6.8 4.3 6.8 8.6s-6.8 4.3-6.8 0" {...stroke} />
          <Path d="M15.4 5.6c0 4.3-6.8 4.3-6.8 8.6" {...stroke} strokeWidth={1.2} />
        </>
      );

    // Logistics — stacked freight.
    case 'PYLN':
      return (
        <>
          <Rect x={6.2} y={12.4} width={5} height={5.4} rx={1} {...stroke} />
          <Rect x={12.8} y={12.4} width={5} height={5.4} rx={1} {...stroke} />
          <Rect x={9.5} y={6.4} width={5} height={5.4} rx={1} {...stroke} />
        </>
      );

    // Fintech Infrastructure — a card with a stripe.
    case 'VERT':
      return (
        <>
          <Rect x={5.4} y={7.6} width={13.2} height={8.8} rx={2} {...stroke} />
          <Path d="M5.4 10.8h13.2" stroke={fg} strokeWidth={2} fill="none" />
        </>
      );

    // Photonics — concentric light.
    case 'HALO':
      return (
        <>
          <Circle cx={12} cy={12} r={2.2} fill={fg} />
          <Circle cx={12} cy={12} r={5} {...stroke} strokeWidth={1.3} />
          <Circle cx={12} cy={12} r={7.6} {...stroke} strokeWidth={1} opacity={0.55} />
        </>
      );

    // Fallback: a plain dot, so an unknown ticker still renders.
    default:
      return <Circle cx={12} cy={12} r={3.4} fill={fg} />;
  }
}
