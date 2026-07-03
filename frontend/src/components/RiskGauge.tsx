import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { colors, font, type } from '../theme/tokens';

type Props = {
  score: number; // 0–100
  size?: number;
  label: string;
  level: 'Low' | 'Moderate' | 'High';
  tint?: string;
};

// Polar coord helpers
const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const a = ((angleDeg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const arcPath = (cx: number, cy: number, r: number, startA: number, endA: number) => {
  const s = polar(cx, cy, r, startA);
  const e = polar(cx, cy, r, endA);
  const largeArc = endA - startA <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
};

export default function RiskGauge({ score, size = 180, label, level, tint }: Props) {
  const stroke = 14;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const pct = Math.max(0, Math.min(100, score));
  const endAngle = (pct / 100) * 180;

  const color =
    tint ??
    (level === 'Low' ? colors.success : level === 'Moderate' ? colors.warning : colors.error);

  return (
    <View style={[styles.wrap, { width: size, height: size * 0.72 }]}>
      <Svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
        <Defs>
          <LinearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <Stop offset="100%" stopColor={color} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Path
          d={arcPath(cx, cy, r, 0, 180)}
          stroke={colors.surfaceTertiary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0 && (
          <Path
            d={arcPath(cx, cy, r, 0, Math.max(1, endAngle))}
            stroke="url(#g1)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {/* Tick marker at end */}
        {pct > 0 && (
          <Circle
            cx={polar(cx, cy, r, endAngle).x}
            cy={polar(cx, cy, r, endAngle).y}
            r={stroke / 2 + 2}
            fill={colors.surfaceSecondary}
            stroke={color}
            strokeWidth={2}
          />
        )}
      </Svg>
      <View style={styles.center}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.smallLabel}>{label}</Text>
        <View style={[styles.pill, { backgroundColor: color }]}>
          <Text style={styles.pillText}>{level} risk</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'flex-start' },
  center: {
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    width: '100%',
  },
  score: {
    fontSize: type.huge,
    fontWeight: font.bold,
    color: colors.onSurface,
    letterSpacing: -1,
  },
  smallLabel: {
    fontSize: type.sm,
    color: colors.onSurfaceSecondary,
    marginTop: 2,
    fontWeight: font.medium,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  pillText: {
    color: colors.onBrandPrimary,
    fontSize: 11,
    fontWeight: font.semibold,
    letterSpacing: 0.2,
  },
});
