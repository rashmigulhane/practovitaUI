import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/tokens';

type Props = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
};

export default function Sparkline({ data, width = 90, height = 34, color = colors.brand, fill = true }: Props) {
  if (!data || data.length < 2) return <Svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return { x, y };
  });
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="sp" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {fill && <Path d={areaPath} fill="url(#sp)" />}
      <Path d={linePath} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
