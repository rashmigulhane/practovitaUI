import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Line, Path, Rect, Circle, Text as SvgText } from 'react-native-svg';

import ScreenHeader from '@/src/components/ScreenHeader';
import StatusPill from '@/src/components/StatusPill';
import { metricTrends, type Reading } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const RANGES = [
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: '1Y', label: '1Y', months: 12 },
  { key: 'All', label: 'All', months: 999 },
] as const;

function statusFor(v: number, low: number, high: number): 'success' | 'warning' | 'error' {
  if (v >= low && v <= high) return 'success';
  if (v > high && v <= high * 1.15) return 'warning';
  if (v < low && v >= low * 0.85) return 'warning';
  return 'error';
}

function statusColor(s: 'success' | 'warning' | 'error') {
  return s === 'success' ? colors.success : s === 'warning' ? colors.warning : colors.error;
}

export default function MetricTrendScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const metric = metricTrends[id ?? 'glc'] ?? metricTrends.glc;
  const [range, setRange] = useState<(typeof RANGES)[number]['key']>('1Y');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Filter readings by range
  const readings = useMemo(() => {
    const monthsBack = RANGES.find((r) => r.key === range)!.months;
    if (monthsBack >= 999) return [...metric.readings].reverse();
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - monthsBack);
    return metric.readings
      .filter((r) => new Date(r.iso) >= cutoff)
      .reverse(); // chronological
  }, [metric, range]);

  const latest = metric.readings[0];
  const prev = metric.readings[1];
  const delta = prev ? +(latest.value - prev.value).toFixed(2) : 0;
  const deltaPct = prev ? ((delta / prev.value) * 100).toFixed(1) : '0';
  const latestStatus = statusFor(latest.value, metric.low, metric.high);
  const STATUS_LABEL = { success: 'Normal', warning: 'Watch', error: 'High' } as const;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={metric.name} subtitle={metric.category} showBack rightIcon="share-outline" />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, shadows.card]}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroValue}>
                {latest.value}
                <Text style={styles.heroUnit}>  {metric.unit}</Text>
              </Text>
              <View style={styles.heroDeltaRow}>
                <Ionicons
                  name={delta > 0 ? 'trending-up' : delta < 0 ? 'trending-down' : 'remove'}
                  size={14}
                  color={delta > 0 ? colors.error : delta < 0 ? colors.brand : colors.onSurfaceSecondary}
                />
                <Text style={[styles.heroDelta, { color: delta > 0 ? colors.error : delta < 0 ? colors.brand : colors.onSurfaceSecondary }]}>
                  {delta > 0 ? '+' : ''}{delta} ({deltaPct}%) vs previous
                </Text>
              </View>
            </View>
            <StatusPill status={latestStatus} label={STATUS_LABEL[latestStatus]} />
          </View>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Ionicons name="calendar-outline" size={11} color={colors.onSurfaceSecondary} />
              <Text style={styles.heroMetaText}>Latest: {latest.date}</Text>
            </View>
            <View style={styles.heroMeta}>
              <Ionicons name="document-text-outline" size={11} color={colors.onSurfaceSecondary} />
              <Text style={styles.heroMetaText}>{metric.readings.length} readings</Text>
            </View>
          </View>
        </View>

        {/* Range picker */}
        <View style={styles.rangeRow}>
          {RANGES.map((r) => {
            const active = r.key === range;
            return (
              <Pressable
                key={r.key}
                testID={`range-${r.key}`}
                onPress={() => {
                  setRange(r.key);
                  setSelectedIdx(null);
                  Haptics.selectionAsync().catch(() => {});
                }}
                style={[styles.rangeBtn, active && styles.rangeBtnActive]}
              >
                <Text style={[styles.rangeText, active && { color: colors.onSurface, fontWeight: font.bold }]}>{r.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, shadows.card]}>
          <TrendChart
            metric={metric}
            readings={readings}
            selectedIdx={selectedIdx}
            onSelect={(i) => {
              Haptics.selectionAsync().catch(() => {});
              setSelectedIdx(i === selectedIdx ? null : i);
            }}
          />
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.brand + '22' }]} />
              <Text style={styles.legendText}>Normal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.warning + '22' }]} />
              <Text style={styles.legendText}>Watch</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: colors.error + '22' }]} />
              <Text style={styles.legendText}>High</Text>
            </View>
          </View>
        </View>

        {/* Reference range card */}
        <View style={[styles.refCard, shadows.card]}>
          <View style={styles.refHeader}>
            <View style={styles.refIcon}>
              <Ionicons name="information-circle-outline" size={16} color={colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.refTitle}>What{'\u2019'}s optimal?</Text>
              <Text style={styles.refValue}>{metric.optimalLabel}</Text>
            </View>
          </View>
          <Text style={styles.refBody}>{metric.explanation}</Text>
        </View>

        {/* All readings */}
        <Text style={styles.sectionTitle}>All readings</Text>
        <View style={[styles.list, shadows.card]}>
          {metric.readings.map((r, i) => {
            const s = statusFor(r.value, metric.low, metric.high);
            const nextReading = metric.readings[i + 1];
            const d = nextReading ? +(r.value - nextReading.value).toFixed(2) : 0;
            return (
              <ReadingRow
                key={r.iso}
                reading={r}
                status={s}
                delta={d}
                unit={metric.unit}
                isFirst={i === 0}
                isLast={i === metric.readings.length - 1}
                onPress={() => router.push(`/report/${r.reportId}`)}
              />
            );
          })}
        </View>

        {/* Ask AI CTA */}
        <Pressable
          testID="ask-ai-trend"
          onPress={() => router.push('/ask')}
          style={[styles.askCta, shadows.card]}
        >
          <View style={styles.askIcon}>
            <Ionicons name="sparkles" size={16} color={colors.onBrandPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.askTitle}>Ask AI about this trend</Text>
            <Text style={styles.askSub}>Why is my {metric.name.toLowerCase()} changing?</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.brand} />
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Chart ---------- */
const CHART_W = 340;
const CHART_H = 200;
const PAD_L = 34;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 30;

function TrendChart({
  metric, readings, selectedIdx, onSelect,
}: {
  metric: (typeof metricTrends)[string];
  readings: Reading[];
  selectedIdx: number | null;
  onSelect: (i: number) => void;
}) {
  if (readings.length === 0) {
    return (
      <View style={{ height: CHART_H, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.onSurfaceSecondary, fontSize: 12 }}>No readings in this range</Text>
      </View>
    );
  }

  const values = readings.map((r) => r.value);
  const rawMin = Math.min(metric.low * 0.85, ...values) - 5;
  const rawMax = Math.max(metric.high * 1.2, ...values) + 5;
  const yMin = Math.max(0, Math.floor(rawMin / 5) * 5);
  const yMax = Math.ceil(rawMax / 5) * 5;

  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;

  const xAt = (i: number) =>
    readings.length === 1 ? PAD_L + innerW / 2 : PAD_L + (i / (readings.length - 1)) * innerW;
  const yAt = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const linePath = readings.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(r.value)}`).join(' ');
  const normalY1 = yAt(metric.high);
  const normalY2 = yAt(metric.low);
  const highY = yAt(yMax);
  const watchY = yAt(metric.high * 1.15);

  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / tickCount);

  return (
    <View>
      <Svg width={CHART_W} height={CHART_H}>
        {/* zones */}
        <Rect x={PAD_L} y={highY} width={innerW} height={watchY - highY} fill={colors.error + '18'} />
        <Rect x={PAD_L} y={watchY} width={innerW} height={normalY1 - watchY} fill={colors.warning + '18'} />
        <Rect x={PAD_L} y={normalY1} width={innerW} height={normalY2 - normalY1} fill={colors.brand + '18'} />

        {/* Y-axis ticks */}
        {ticks.map((t, i) => (
          <React.Fragment key={i}>
            <Line
              x1={PAD_L}
              y1={yAt(t)}
              x2={PAD_L + innerW}
              y2={yAt(t)}
              stroke={colors.divider}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <SvgText
              x={PAD_L - 6}
              y={yAt(t) + 3}
              fontSize={9}
              fill={colors.onSurfaceSecondary}
              textAnchor="end"
              fontWeight="600"
            >
              {t.toFixed(t < 20 ? 1 : 0)}
            </SvgText>
          </React.Fragment>
        ))}

        {/* upper/lower ref lines */}
        <Line x1={PAD_L} y1={normalY1} x2={PAD_L + innerW} y2={normalY1} stroke={colors.brand} strokeWidth={1} />
        <Line x1={PAD_L} y1={normalY2} x2={PAD_L + innerW} y2={normalY2} stroke={colors.brand} strokeWidth={1} />

        {/* line */}
        <Path d={linePath} stroke={colors.onSurface} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* points */}
        {readings.map((r, i) => {
          const s = statusFor(r.value, metric.low, metric.high);
          const isSel = i === selectedIdx;
          return (
            <React.Fragment key={i}>
              <Circle
                cx={xAt(i)}
                cy={yAt(r.value)}
                r={isSel ? 7 : 4.5}
                fill={colors.surface}
                stroke={statusColor(s)}
                strokeWidth={isSel ? 3 : 2}
              />
              {isSel && (
                <Circle cx={xAt(i)} cy={yAt(r.value)} r={2.5} fill={statusColor(s)} />
              )}
            </React.Fragment>
          );
        })}

        {/* x-axis month labels (first, middle, last) */}
        {[0, Math.floor(readings.length / 2), readings.length - 1].map((i) => {
          if (i < 0 || i >= readings.length) return null;
          const dateShort = readings[i].date.split(',')[0];
          return (
            <SvgText
              key={`x-${i}`}
              x={xAt(i)}
              y={CHART_H - 10}
              fontSize={9}
              fill={colors.onSurfaceSecondary}
              textAnchor="middle"
              fontWeight="600"
            >
              {dateShort}
            </SvgText>
          );
        })}
      </Svg>

      {/* Overlay tap targets */}
      <View style={StyleSheet.absoluteFill}>
        {readings.map((r, i) => (
          <Pressable
            key={i}
            testID={`chart-point-${i}`}
            onPress={() => onSelect(i)}
            style={{
              position: 'absolute',
              left: xAt(i) - 20,
              top: yAt(r.value) - 20,
              width: 40, height: 40,
            }}
          />
        ))}
      </View>

      {/* Tooltip */}
      {selectedIdx !== null && readings[selectedIdx] && (
        <View
          style={[
            styles.tooltip,
            {
              left: Math.min(Math.max(xAt(selectedIdx) - 60, 8), CHART_W - 128),
              top: Math.max(yAt(readings[selectedIdx].value) - 62, 4),
            },
          ]}
        >
          <Text style={styles.tooltipVal}>
            {readings[selectedIdx].value} <Text style={styles.tooltipUnit}>{metric.unit}</Text>
          </Text>
          <Text style={styles.tooltipDate}>{readings[selectedIdx].date}</Text>
          <Text style={styles.tooltipReport} numberOfLines={1}>{readings[selectedIdx].reportLabel}</Text>
        </View>
      )}
    </View>
  );
}

function ReadingRow({ reading, status, delta, unit, isFirst, isLast, onPress }: any) {
  const STATUS_LABEL = { success: 'Normal', warning: 'Watch', error: 'High' } as const;
  return (
    <Pressable testID={`reading-${reading.iso}`} onPress={onPress} style={[styles.readingRow, !isLast && styles.rowBorder]}>
      <View style={styles.timelineCol}>
        <View style={[styles.timelineDot, { backgroundColor: statusColor(status) }]}>
          {isFirst && <View style={styles.latestPulse} />}
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.readingHead}>
          <Text style={styles.readingValue}>
            {reading.value}
            <Text style={styles.readingUnit}> {unit}</Text>
          </Text>
          {isFirst && (
            <View style={styles.latestPill}>
              <Text style={styles.latestPillText}>LATEST</Text>
            </View>
          )}
          {!isFirst && delta !== 0 && (
            <View style={styles.deltaPill}>
              <Ionicons
                name={delta > 0 ? 'trending-up' : 'trending-down'}
                size={10}
                color={delta > 0 ? colors.error : colors.brand}
              />
              <Text style={[styles.deltaText, { color: delta > 0 ? colors.error : colors.brand }]}>
                {delta > 0 ? '+' : ''}{delta}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.readingDate}>{reading.date}</Text>
        <View style={styles.readingSourceRow}>
          <Ionicons name="document-text-outline" size={11} color={colors.brand} />
          <Text style={styles.readingSource}>{reading.reportLabel}</Text>
          <Ionicons name="arrow-forward" size={10} color={colors.brand} />
        </View>
      </View>
      <StatusPill status={status} label={STATUS_LABEL[status]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },

  hero: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLeft: { flex: 1 },
  heroValue: { fontSize: 40, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -1.2 },
  heroUnit: { fontSize: 14, fontWeight: font.medium, color: colors.onSurfaceSecondary },
  heroDeltaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  heroDelta: { fontSize: 12, fontWeight: font.semibold },
  heroMetaRow: {
    flexDirection: 'row', gap: spacing.md, marginTop: spacing.md,
    paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },

  rangeRow: {
    flexDirection: 'row', padding: 3, borderRadius: radius.md,
    backgroundColor: colors.surfaceTertiary,
  },
  rangeBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  rangeBtnActive: { backgroundColor: colors.surfaceSecondary, ...shadows.card },
  rangeText: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurfaceSecondary },

  chartCard: {
    padding: spacing.md, paddingRight: 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row', gap: spacing.md, marginTop: 6,
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendBox: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.semibold },

  tooltip: {
    position: 'absolute',
    padding: 8, borderRadius: radius.sm,
    backgroundColor: colors.onSurface,
    minWidth: 120,
    ...shadows.cardStrong,
  },
  tooltipVal: { color: '#FFF', fontSize: 16, fontWeight: font.bold, letterSpacing: -0.3 },
  tooltipUnit: { fontSize: 10, fontWeight: font.medium, color: 'rgba(255,255,255,0.7)' },
  tooltipDate: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2, fontWeight: font.medium },
  tooltipReport: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 3 },

  refCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
  },
  refHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  refIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  refTitle: { fontSize: 11, color: colors.brand, fontWeight: font.bold, letterSpacing: 0.4 },
  refValue: { fontSize: type.base, fontWeight: font.bold, color: colors.onBrandTertiary, marginTop: 2 },
  refBody: { fontSize: 12, color: colors.onBrandTertiary, lineHeight: 18, marginTop: 8 },

  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginTop: spacing.sm },
  list: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  readingRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, alignItems: 'flex-start' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  timelineCol: { alignItems: 'center', width: 16, paddingTop: 4 },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  latestPulse: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.brand, opacity: 0.35 },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.divider, marginTop: 4, minHeight: 30 },
  readingHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readingValue: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  readingUnit: { fontSize: 11, fontWeight: font.medium, color: colors.onSurfaceSecondary },
  latestPill: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  latestPillText: { fontSize: 9, color: colors.onBrandPrimary, fontWeight: font.bold, letterSpacing: 0.6 },
  deltaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999,
    backgroundColor: colors.surfaceTertiary,
  },
  deltaText: { fontSize: 10, fontWeight: font.bold },
  readingDate: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 3, fontWeight: font.medium },
  readingSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  readingSource: { fontSize: 11, color: colors.brand, fontWeight: font.semibold, flex: 1 },

  askCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, marginTop: spacing.sm,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.brandSecondary + '55',
  },
  askIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  askTitle: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface },
  askSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
});
