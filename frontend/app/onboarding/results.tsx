import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Line, Path, Circle, Text as SvgText, Rect } from 'react-native-svg';

import RiskGauge from '@/src/components/RiskGauge';
import PrimaryButton from '@/src/components/PrimaryButton';
import { riskScores, riskHistory, riskDrivers } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

type ViewMode = 'current' | 'journey';

export default function ResultsScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<ViewMode>('current');
  const hasReports = riskHistory.some((r) => r.event === 'report');
  const first = riskHistory[0];
  const latest = riskHistory[riskHistory.length - 1];
  const diabetesDelta = latest.diabetes - first.diabetes;
  const cvdDelta = latest.cvd - first.cvd;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable testID="results-back" onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Health risk</Text>
        <View style={styles.iconBtn} />
      </View>

      {/* Mode switcher */}
      <View style={styles.modeRow}>
        <ModeBtn label="Current" active={mode === 'current'} onPress={() => setMode('current')} testID="mode-current" />
        <ModeBtn label="Journey" active={mode === 'journey'} onPress={() => setMode('journey')} testID="mode-journey" badge={hasReports ? riskHistory.length : undefined} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {mode === 'current' && (
          <>
            <View style={styles.eyebrowRow}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={16} color={colors.onBrandPrimary} />
              </View>
              <Text style={styles.eyebrow}>ASSESSMENT COMPLETE</Text>
            </View>

            <Text style={styles.title}>Your baseline risk scores</Text>
            <Text style={styles.subtitle}>
              Updated with your latest report — Nov 12, 2025. Upload a new report anytime to refine these further.
            </Text>

            {/* Diabetes */}
            <View style={[styles.card, shadows.card]}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardEyebrow}>DIABETES</Text>
                  <Text style={styles.cardTitle}>Type 2 risk</Text>
                </View>
                <View style={styles.deltaBadge}>
                  <Ionicons
                    name={diabetesDelta < 0 ? 'trending-down' : 'trending-up'}
                    size={12}
                    color={diabetesDelta < 0 ? colors.brand : colors.error}
                  />
                  <Text style={[styles.deltaText, { color: diabetesDelta < 0 ? colors.brand : colors.error }]}>
                    {diabetesDelta > 0 ? '+' : ''}{diabetesDelta} since baseline
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', marginTop: spacing.md }}>
                <RiskGauge score={riskScores.diabetes.score} level={riskScores.diabetes.level} label="risk score" size={220} />
              </View>
              <View style={styles.factors}>
                <Text style={styles.factorLabel}>Key factors</Text>
                {riskScores.diabetes.factors.map((f) => (
                  <View key={f} style={styles.factorRow}>
                    <View style={styles.factorDot} />
                    <Text style={styles.factorText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CVD */}
            <View style={[styles.card, shadows.card]}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardEyebrow}>CARDIOVASCULAR</Text>
                  <Text style={styles.cardTitle}>10-year CVD risk</Text>
                </View>
                <View style={styles.deltaBadge}>
                  <Ionicons
                    name={cvdDelta < 0 ? 'trending-down' : 'trending-up'}
                    size={12}
                    color={cvdDelta < 0 ? colors.brand : colors.error}
                  />
                  <Text style={[styles.deltaText, { color: cvdDelta < 0 ? colors.brand : colors.error }]}>
                    {cvdDelta > 0 ? '+' : ''}{cvdDelta} since baseline
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', marginTop: spacing.md }}>
                <RiskGauge score={riskScores.cvd.score} level={riskScores.cvd.level} label="risk score" size={220} />
              </View>
              <View style={styles.factors}>
                <Text style={styles.factorLabel}>Key factors</Text>
                {riskScores.cvd.factors.map((f) => (
                  <View key={f} style={styles.factorRow}>
                    <View style={styles.factorDot} />
                    <Text style={styles.factorText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <PrimaryButton testID="upload-refine" label="Upload report to refine" onPress={() => router.push('/upload')} />
              <Pressable
                testID="see-journey"
                onPress={() => setMode('journey')}
                style={styles.ghostBtn}
              >
                <Ionicons name="analytics-outline" size={16} color={colors.brand} />
                <Text style={styles.ghostBtnText}>See how risk evolved over time</Text>
              </Pressable>
            </View>
          </>
        )}

        {mode === 'journey' && (!hasReports ? (
          <EmptyState onUpload={() => router.push('/upload')} />
        ) : (
          <JourneyView latest={latest} first={first} diabetesDelta={diabetesDelta} cvdDelta={cvdDelta} onUpload={() => router.push('/upload')} />
        ))}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Mode Button ---------- */
function ModeBtn({ label, active, onPress, testID, badge }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.modeBtn, active && styles.modeBtnActive]}>
      <Text style={[styles.modeLabel, active && { color: colors.onSurface, fontWeight: font.bold }]}>{label}</Text>
      {badge && (
        <View style={[styles.modeBadge, active && { backgroundColor: colors.brand }]}>
          <Text style={[styles.modeBadgeText, active && { color: colors.onBrandPrimary }]}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

/* ---------- Empty State ---------- */
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="analytics-outline" size={40} color={colors.brand} />
      </View>
      <Text style={styles.emptyTitle}>No history yet</Text>
      <Text style={styles.emptySub}>
        Your risk journey chart appears once you upload at least one blood report. Baseline scores come from your questionnaire.
      </Text>
      <View style={[styles.baselineCard, shadows.card]}>
        <Text style={styles.baselineEyebrow}>QUESTIONNAIRE BASELINE</Text>
        <View style={styles.baselineRow}>
          <View style={styles.baselineCol}>
            <Text style={styles.baselineLbl}>Diabetes</Text>
            <Text style={styles.baselineVal}>{riskHistory[0].diabetes}</Text>
          </View>
          <View style={styles.baselineDivider} />
          <View style={styles.baselineCol}>
            <Text style={styles.baselineLbl}>CVD</Text>
            <Text style={styles.baselineVal}>{riskHistory[0].cvd}</Text>
          </View>
        </View>
      </View>
      <PrimaryButton testID="empty-upload" label="Upload your first report" onPress={onUpload} style={{ marginTop: spacing.lg, width: '100%' }} />
    </View>
  );
}

/* ---------- Journey View ---------- */
function JourneyView({ latest, first, diabetesDelta, cvdDelta, onUpload }: any) {
  return (
    <>
      {/* Deltas hero */}
      <View style={styles.journeyHeader}>
        <Text style={styles.title}>Risk journey</Text>
        <Text style={styles.subtitle}>
          How your scores evolved from questionnaire to {latest.date}
        </Text>
      </View>

      {/* Summary cards */}
      <View style={styles.deltaCards}>
        <View style={[styles.deltaCard, shadows.card]}>
          <View style={styles.deltaCardHead}>
            <Ionicons name="water-outline" size={16} color={colors.brand} />
            <Text style={styles.deltaCardLbl}>Diabetes</Text>
          </View>
          <View style={styles.deltaValueRow}>
            <Text style={styles.deltaFrom}>{first.diabetes}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.onSurfaceSecondary} />
            <Text style={styles.deltaTo}>{latest.diabetes}</Text>
          </View>
          <View style={[styles.deltaChangeChip, { backgroundColor: diabetesDelta < 0 ? colors.brandTertiary : '#F6DAD5' }]}>
            <Ionicons
              name={diabetesDelta < 0 ? 'trending-down' : 'trending-up'}
              size={11}
              color={diabetesDelta < 0 ? colors.brand : colors.error}
            />
            <Text style={[styles.deltaChangeText, { color: diabetesDelta < 0 ? colors.brand : colors.error }]}>
              {diabetesDelta > 0 ? '+' : ''}{diabetesDelta} pts
            </Text>
          </View>
        </View>

        <View style={[styles.deltaCard, shadows.card]}>
          <View style={styles.deltaCardHead}>
            <Ionicons name="heart-outline" size={16} color={colors.brand} />
            <Text style={styles.deltaCardLbl}>CVD</Text>
          </View>
          <View style={styles.deltaValueRow}>
            <Text style={styles.deltaFrom}>{first.cvd}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.onSurfaceSecondary} />
            <Text style={styles.deltaTo}>{latest.cvd}</Text>
          </View>
          <View style={[styles.deltaChangeChip, { backgroundColor: cvdDelta < 0 ? colors.brandTertiary : '#F6DAD5' }]}>
            <Ionicons
              name={cvdDelta < 0 ? 'trending-down' : 'trending-up'}
              size={11}
              color={cvdDelta < 0 ? colors.brand : colors.error}
            />
            <Text style={[styles.deltaChangeText, { color: cvdDelta < 0 ? colors.brand : colors.error }]}>
              {cvdDelta > 0 ? '+' : ''}{cvdDelta} pts
            </Text>
          </View>
        </View>
      </View>

      {/* Dual-line chart */}
      <View style={[styles.chartCard, shadows.card]}>
        <View style={styles.chartLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Diabetes</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.brand }]} />
            <Text style={styles.legendText}>CVD</Text>
          </View>
        </View>
        <JourneyChart />
      </View>

      {/* Timeline */}
      <Text style={styles.sectionTitle}>Every update</Text>
      <View style={[styles.timelineCard, shadows.card]}>
        {[...riskHistory].reverse().map((cp, i, arr) => {
          const isLatest = i === 0;
          const prev = arr[i + 1];
          const dDelta = prev ? cp.diabetes - prev.diabetes : 0;
          const cDelta = prev ? cp.cvd - prev.cvd : 0;
          return (
            <TimelineRow
              key={cp.id}
              checkpoint={cp}
              isLatest={isLatest}
              isLast={i === arr.length - 1}
              diabetesDelta={dDelta}
              cvdDelta={cDelta}
              isBaseline={cp.event === 'questionnaire'}
            />
          );
        })}
      </View>

      {/* Drivers */}
      <Text style={styles.sectionTitle}>What{'\u2019'}s driving your risk now</Text>
      <View style={[styles.driversCard, shadows.card]}>
        {riskDrivers.map((d, i) => (
          <View key={d.metric} style={[styles.driverRow, i < riskDrivers.length - 1 && styles.driverRowBorder]}>
            <View style={[styles.driverIcon, { backgroundColor: d.impact === 'down' ? colors.brandTertiary : '#F6DAD5' }]}>
              <Ionicons
                name={d.impact === 'down' ? 'arrow-down' : 'arrow-up'}
                size={14}
                color={d.impact === 'down' ? colors.brand : colors.error}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverMetric}>{d.metric}</Text>
              <Text style={styles.driverChange}>
                {d.from} → <Text style={{ fontWeight: font.bold, color: colors.onSurface }}>{d.to}</Text>
              </Text>
            </View>
            <View style={styles.affectsPills}>
              {(d.affects === 'diabetes' || d.affects === 'both') && (
                <View style={[styles.affectsPill, { backgroundColor: colors.warning + '22' }]}>
                  <Text style={[styles.affectsText, { color: '#8A4A20' }]}>Diabetes</Text>
                </View>
              )}
              {(d.affects === 'cvd' || d.affects === 'both') && (
                <View style={[styles.affectsPill, { backgroundColor: colors.brandTertiary }]}>
                  <Text style={[styles.affectsText, { color: colors.brand }]}>CVD</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton testID="journey-upload" label="Upload new report" onPress={onUpload} style={{ marginTop: spacing.xl }} />
    </>
  );
}

/* ---------- Timeline Row ---------- */
function TimelineRow({ checkpoint, isLatest, isLast, diabetesDelta, cvdDelta, isBaseline }: any) {
  const router = useRouter();
  return (
    <Pressable
      testID={`checkpoint-${checkpoint.id}`}
      onPress={() => checkpoint.reportId && router.push(`/report/${checkpoint.reportId}`)}
      style={styles.timelineRow}
    >
      <View style={styles.timelineCol}>
        <View style={[
          styles.timelineDot,
          isBaseline && { backgroundColor: colors.onSurfaceSecondary },
          isLatest && { backgroundColor: colors.brand, borderColor: colors.brand, width: 14, height: 14 },
        ]}>
          {isLatest && <View style={styles.timelinePulse} />}
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineBody}>
        <View style={styles.timelineHead}>
          <Text style={styles.timelineLabel}>{checkpoint.label}</Text>
          {isLatest && (
            <View style={styles.latestPill}>
              <Text style={styles.latestPillText}>LATEST</Text>
            </View>
          )}
          {isBaseline && (
            <View style={[styles.latestPill, { backgroundColor: colors.surfaceTertiary }]}>
              <Text style={[styles.latestPillText, { color: colors.onSurfaceSecondary }]}>QUESTIONNAIRE</Text>
            </View>
          )}
        </View>
        <View style={styles.timelineSubRow}>
          <Ionicons name={checkpoint.event === 'report' ? 'document-text-outline' : 'clipboard-outline'} size={11} color={colors.onSurfaceSecondary} />
          <Text style={styles.timelineSub}>{checkpoint.sublabel}</Text>
          <View style={styles.miniDot} />
          <Text style={styles.timelineDate}>{checkpoint.date}</Text>
        </View>
        <View style={styles.scoresRow}>
          <View style={styles.scoreChip}>
            <View style={[styles.scoreDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.scoreLbl}>Diab</Text>
            <Text style={styles.scoreVal}>{checkpoint.diabetes}</Text>
            {!isBaseline && diabetesDelta !== 0 && (
              <Text style={[styles.scoreDelta, { color: diabetesDelta < 0 ? colors.brand : colors.error }]}>
                {diabetesDelta > 0 ? '+' : ''}{diabetesDelta}
              </Text>
            )}
          </View>
          <View style={styles.scoreChip}>
            <View style={[styles.scoreDot, { backgroundColor: colors.brand }]} />
            <Text style={styles.scoreLbl}>CVD</Text>
            <Text style={styles.scoreVal}>{checkpoint.cvd}</Text>
            {!isBaseline && cvdDelta !== 0 && (
              <Text style={[styles.scoreDelta, { color: cvdDelta < 0 ? colors.brand : colors.error }]}>
                {cvdDelta > 0 ? '+' : ''}{cvdDelta}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* ---------- Journey chart (dual line) ---------- */
const CH_W = 320;
const CH_H = 200;
const CP_L = 30;
const CP_R = 12;
const CP_T = 16;
const CP_B = 40;

function JourneyChart() {
  const points = riskHistory;
  const innerW = CH_W - CP_L - CP_R;
  const innerH = CH_H - CP_T - CP_B;
  const yMax = 60;
  const yMin = 0;
  const xAt = (i: number) => CP_L + (i / (points.length - 1)) * innerW;
  const yAt = (v: number) => CP_T + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const diaPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(p.diabetes)}`).join(' ');
  const cvdPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(p.cvd)}`).join(' ');
  const ticks = [0, 20, 40, 60];

  return (
    <Svg width={CH_W} height={CH_H}>
      {/* Baseline shading */}
      <Rect x={CP_L} y={yAt(60)} width={innerW} height={yAt(30) - yAt(60)} fill={colors.error + '10'} />
      <Rect x={CP_L} y={yAt(30)} width={innerW} height={yAt(15) - yAt(30)} fill={colors.warning + '10'} />
      <Rect x={CP_L} y={yAt(15)} width={innerW} height={yAt(0) - yAt(15)} fill={colors.brand + '10'} />

      {/* Gridlines + Y labels */}
      {ticks.map((t) => (
        <React.Fragment key={t}>
          <Line
            x1={CP_L} y1={yAt(t)} x2={CP_L + innerW} y2={yAt(t)}
            stroke={colors.divider} strokeWidth={1} strokeDasharray="3 4"
          />
          <SvgText
            x={CP_L - 6} y={yAt(t) + 3}
            fontSize={9} fill={colors.onSurfaceSecondary}
            textAnchor="end" fontWeight="600"
          >
            {t}
          </SvgText>
        </React.Fragment>
      ))}

      {/* Lines */}
      <Path d={diaPath} stroke={colors.warning} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={cvdPath} stroke={colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points + baseline star */}
      {points.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={xAt(i)} cy={yAt(p.diabetes)} r={i === points.length - 1 ? 6 : 3.5} fill={colors.surface} stroke={colors.warning} strokeWidth={2} />
          <Circle cx={xAt(i)} cy={yAt(p.cvd)} r={i === points.length - 1 ? 6 : 3.5} fill={colors.surface} stroke={colors.brand} strokeWidth={2} />
          {p.event === 'questionnaire' && (
            <Circle cx={xAt(i)} cy={CH_H - 22} r={3} fill={colors.onSurfaceSecondary} />
          )}
          {p.event === 'report' && (
            <Rect x={xAt(i) - 3} y={CH_H - 25} width={6} height={6} fill={colors.brand} />
          )}
        </React.Fragment>
      ))}

      {/* X-axis labels — sparse */}
      {[0, Math.floor(points.length / 2), points.length - 1].map((i) => (
        <SvgText
          key={`x-${i}`}
          x={xAt(i)} y={CH_H - 8}
          fontSize={9} fill={colors.onSurfaceSecondary}
          textAnchor="middle" fontWeight="600"
        >
          {points[i].date.split(',')[0].split(' ').slice(0, 2).join(' ')}
        </SvgText>
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },

  modeRow: {
    flexDirection: 'row', padding: 3, marginHorizontal: spacing.lg, marginBottom: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.surfaceTertiary,
  },
  modeBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 9,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  modeBtnActive: { backgroundColor: colors.surfaceSecondary, ...shadows.card },
  modeLabel: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  modeBadge: {
    paddingHorizontal: 6, minWidth: 20, height: 18,
    borderRadius: 999, backgroundColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  modeBadgeText: { fontSize: 10, fontWeight: font.bold, color: colors.onSurface },

  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },

  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: { fontSize: 11, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.6 },

  title: {
    fontSize: 28, fontWeight: font.bold, color: colors.onSurface,
    marginTop: spacing.md, letterSpacing: -0.6, lineHeight: 34,
  },
  subtitle: { fontSize: type.base, color: colors.onSurfaceSecondary, marginTop: spacing.sm, lineHeight: 21 },

  card: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.4 },
  cardTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, marginTop: 2, letterSpacing: -0.3 },
  deltaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, backgroundColor: colors.surfaceTertiary,
  },
  deltaText: { fontSize: 11, fontWeight: font.bold },
  factors: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider, gap: 8 },
  factorLabel: { fontSize: 11, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.2 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  factorDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: colors.brand },
  factorText: { fontSize: type.base, color: colors.onSurface },

  footer: { marginTop: spacing.xl, gap: spacing.md },
  ghostBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
  },
  ghostBtnText: { fontSize: 13, fontWeight: font.bold, color: colors.brand },

  /* Empty state */
  empty: { alignItems: 'center', paddingTop: spacing.xl },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: type.xxl, fontWeight: font.bold, color: colors.onSurface, marginTop: spacing.md, letterSpacing: -0.4 },
  emptySub: { fontSize: 13, color: colors.onSurfaceSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 19, paddingHorizontal: spacing.md },
  baselineCard: {
    marginTop: spacing.xl, padding: spacing.lg, width: '100%',
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  baselineEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.4 },
  baselineRow: { flexDirection: 'row', marginTop: spacing.md },
  baselineCol: { flex: 1, alignItems: 'center' },
  baselineLbl: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.semibold },
  baselineVal: { fontSize: 32, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.8, marginTop: 4 },
  baselineDivider: { width: 1, backgroundColor: colors.divider },

  /* Journey */
  journeyHeader: { marginBottom: spacing.md },
  deltaCards: { flexDirection: 'row', gap: spacing.md },
  deltaCard: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  deltaCardHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deltaCardLbl: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  deltaValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  deltaFrom: { fontSize: 20, color: colors.onSurfaceSecondary, fontWeight: font.bold, textDecorationLine: 'line-through' },
  deltaTo: { fontSize: 28, color: colors.onSurface, fontWeight: font.bold, letterSpacing: -0.6 },
  deltaChangeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
    alignSelf: 'flex-start',
  },
  deltaChangeText: { fontSize: 11, fontWeight: font.bold },

  chartCard: {
    marginTop: spacing.md,
    padding: spacing.md, paddingRight: 0,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  chartLegendRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'flex-start', marginBottom: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 14, height: 3, borderRadius: 2 },
  legendText: { fontSize: 11, color: colors.onSurface, fontWeight: font.semibold },

  sectionTitle: {
    fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface,
    letterSpacing: -0.3, marginTop: spacing.xl, marginBottom: spacing.md,
  },

  timelineCard: {
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  timelineCol: { alignItems: 'center', width: 14, paddingTop: 4 },
  timelineDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.brandSecondary,
    borderWidth: 2, borderColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  timelinePulse: {
    position: 'absolute', width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.brand, opacity: 0.3,
  },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.divider, marginTop: 4, minHeight: 60 },
  timelineBody: { flex: 1, paddingBottom: spacing.md },
  timelineHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timelineLabel: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface },
  latestPill: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  latestPillText: { fontSize: 9, color: colors.onBrandPrimary, fontWeight: font.bold, letterSpacing: 0.5 },
  timelineSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  timelineSub: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  timelineDate: { fontSize: 11, color: colors.onSurfaceSecondary },
  miniDot: { width: 2, height: 2, borderRadius: 999, backgroundColor: colors.onSurfaceSecondary, opacity: 0.6 },
  scoresRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 8 },
  scoreChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999, backgroundColor: colors.surfaceTertiary,
  },
  scoreDot: { width: 6, height: 6, borderRadius: 3 },
  scoreLbl: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 0.4 },
  scoreVal: { fontSize: 13, fontWeight: font.bold, color: colors.onSurface },
  scoreDelta: { fontSize: 10, fontWeight: font.bold, marginLeft: 2 },

  driversCard: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  driverRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  driverRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  driverIcon: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  driverMetric: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  driverChange: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  affectsPills: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 100 },
  affectsPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  affectsText: { fontSize: 9, fontWeight: font.bold, letterSpacing: 0.3 },
});
