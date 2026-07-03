import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';

import AskFab from '@/src/components/AskFab';
import { dietPlan, workouts, habits, wellnessScore, weekSummary, monthHeatmap } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

type Tab = 'today' | 'diet' | 'workout';
type Range = 'day' | 'week' | 'month';

function ProgressRing({ progress, size = 68, stroke = 6 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceTertiary} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={colors.brand} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </Svg>
      <Text style={{ position: 'absolute', fontSize: 14, fontWeight: font.bold, color: colors.brand }}>{progress}%</Text>
    </View>
  );
}

export default function PlanScreen() {
  const [tab, setTab] = useState<Tab>('today');
  const [range, setRange] = useState<Range>('day');
  const [checked, setChecked] = useState<Record<string, boolean>>({ h1: true, h2: true, h6: true });
  const [mealDone, setMealDone] = useState<Record<string, boolean>>({ d1: true });

  const toggle = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  };
  const toggleMeal = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setMealDone((c) => ({ ...c, [id]: !c[id] }));
  };

  const doneCount = habits.filter((h) => checked[h.id]).length;
  const progress = Math.round((doneCount / habits.length) * 100);
  const totalKcal = dietPlan.reduce((s, m) => s + m.kcal, 0);
  const mealsDone = dietPlan.filter((m) => mealDone[m.id]).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Sticky header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Plan</Text>
            <Text style={styles.sub}>Your wellness roadmap</Text>
          </View>
          <View style={styles.dateChip}>
            <Ionicons name="calendar-outline" size={14} color={colors.brand} />
            <Text style={styles.dateText}>
              {range === 'day' ? 'Today' : range === 'week' ? 'This week' : 'Nov 2025'}
            </Text>
          </View>
        </View>

        {/* Range segmented control */}
        <View style={styles.rangeRow}>
          <RangeBtn label="Day" active={range === 'day'} onPress={() => setRange('day')} testID="range-day" />
          <RangeBtn label="Week" active={range === 'week'} onPress={() => setRange('week')} testID="range-week" />
          <RangeBtn label="Month" active={range === 'month'} onPress={() => setRange('month')} testID="range-month" />
        </View>

        {/* Category tabs (only in day view) */}
        {range === 'day' && (
          <View style={styles.tabsRow}>
            <TabBtn label="Today" active={tab === 'today'} onPress={() => setTab('today')} testID="tab-today" />
            <TabBtn label="Diet" active={tab === 'diet'} onPress={() => setTab('diet')} testID="tab-diet" />
            <TabBtn label="Workout" active={tab === 'workout'} onPress={() => setTab('workout')} testID="tab-workout" />
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {range === 'week' && <WeekView />}
        {range === 'month' && <MonthView />}

        {range === 'day' && tab === 'today' && (
          <>
            {/* Daily progress card */}
            <View style={[styles.progressCard, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressEyebrow}>DAILY HABITS</Text>
                <Text style={styles.progressTitle}>{doneCount} of {habits.length} complete</Text>
                <View style={styles.streakRow}>
                  <Ionicons name="flame" size={14} color="#D18E62" />
                  <Text style={styles.streakText}>{wellnessScore.streak}-day streak · Keep it going!</Text>
                </View>
              </View>
              <ProgressRing progress={progress} />
            </View>

            {/* Habits list */}
            <Text style={styles.sectionTitle}>Habits</Text>
            <View style={[styles.list, shadows.card]}>
              {habits.map((h, i) => {
                const done = !!checked[h.id];
                return (
                  <Pressable
                    key={h.id}
                    testID={`habit-${h.id}`}
                    onPress={() => toggle(h.id)}
                    style={[styles.habitRow, i < habits.length - 1 && styles.rowBorder]}
                  >
                    <View style={[styles.habitCheck, done && styles.habitCheckDone]}>
                      {done && <Ionicons name="checkmark" size={14} color={colors.onBrandPrimary} />}
                    </View>
                    <View style={[styles.habitIcon, done && { backgroundColor: colors.brandTertiary }]}>
                      <Ionicons name={h.icon as any} size={16} color={done ? colors.brand : colors.onSurfaceSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.habitTitle, done && styles.habitTitleDone]}>{h.title}</Text>
                      <Text style={styles.habitMeta}>Target: {h.target}</Text>
                    </View>
                    <View style={[styles.catPill, styles[`cat_${h.category}` as const]]}>
                      <Text style={styles.catText}>{h.category}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Quick stats */}
            <View style={styles.statsRow}>
              <StatCard icon="restaurant-outline" label="Meals" value={`${mealsDone}/${dietPlan.length}`} />
              <StatCard icon="barbell-outline" label="Workouts" value="1/1" />
              <StatCard icon="water-outline" label="Water" value="1.2 L" />
            </View>
          </>
        )}

        {range === 'day' && tab === 'diet' && (
          <>
            <View style={[styles.summaryCard, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Today{'\u2019'}s target</Text>
                <Text style={styles.summaryValue}>{totalKcal} <Text style={styles.summaryUnit}>kcal</Text></Text>
                <Text style={styles.summarySub}>Heart-healthy · Low glycemic</Text>
              </View>
              <View style={styles.macroCol}>
                <MacroPill label="P" value="98g" />
                <MacroPill label="C" value="182g" />
                <MacroPill label="F" value="52g" />
              </View>
            </View>

            {dietPlan.map((meal) => {
              const done = !!mealDone[meal.id];
              return (
                <View key={meal.id} style={[styles.mealCard, shadows.card]}>
                  <View style={styles.mealHead}>
                    <Pressable
                      testID={`meal-check-${meal.id}`}
                      onPress={() => toggleMeal(meal.id)}
                      style={[styles.habitCheck, done && styles.habitCheckDone]}
                    >
                      {done && <Ionicons name="checkmark" size={14} color={colors.onBrandPrimary} />}
                    </Pressable>
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={[styles.mealTitle, done && { textDecorationLine: 'line-through', color: colors.onSurfaceSecondary }]}>
                        {meal.title}
                      </Text>
                      <Text style={styles.mealMeta}>{meal.kcal} kcal · <Text style={{ color: colors.brand, fontWeight: font.semibold }}>{meal.tag}</Text></Text>
                    </View>
                    <Pressable testID={`meal-${meal.id}-swap`} style={styles.smallBtn}>
                      <Ionicons name="swap-horizontal" size={16} color={colors.brand} />
                    </Pressable>
                  </View>
                  <View style={styles.mealItems}>
                    {meal.items.map((it, i) => (
                      <View key={i} style={styles.itemRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.itemText}>{it}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}

        {range === 'day' && tab === 'workout' && (
          <>
            <View style={[styles.summaryCard, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>This week</Text>
                <Text style={styles.summaryValue}>3 / 5 <Text style={styles.summaryUnit}>sessions</Text></Text>
                <Text style={styles.summarySub}>150 min moderate activity</Text>
              </View>
              <ProgressRing progress={60} size={68} />
            </View>

            <Text style={styles.sectionTitle}>Recommended today</Text>
            {workouts.map((w) => (
              <Pressable key={w.id} testID={`workout-${w.id}`} style={[styles.workoutCard, shadows.card]}>
                <View style={styles.workoutIcon}>
                  <Ionicons name={w.icon as any} size={22} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.workoutTitle}>{w.title}</Text>
                  <Text style={styles.workoutMeta}>{w.duration} · {w.intensity} intensity</Text>
                </View>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={16} color={colors.onBrandPrimary} />
                </View>
              </Pressable>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <AskFab bottom={100} />
    </SafeAreaView>
  );
}

function TabBtn({ label, active, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabLabel, active && { color: colors.onBrandPrimary }]}>{label}</Text>
    </Pressable>
  );
}

function RangeBtn({ label, active, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.rangeBtn, active && styles.rangeBtnActive]}>
      <Text style={[styles.rangeLabel, active && { color: colors.onSurface, fontWeight: font.bold }]}>{label}</Text>
    </Pressable>
  );
}

function WeekView() {
  const router = useRouter();
  const maxH = 6;
  return (
    <>
      <View style={[styles.progressCard, shadows.card]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.progressEyebrow}>THIS WEEK</Text>
          <Text style={styles.progressTitle}>{weekSummary.totals.habitsDone} / {weekSummary.totals.habitsTarget} habits</Text>
          <Text style={{ fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 4 }}>
            {weekSummary.totals.workouts} workouts · {weekSummary.totals.mealsLogged} meals logged
          </Text>
        </View>
      </View>

      {/* Week ahead CTA */}
      <Pressable
        testID="open-week-ahead"
        onPress={() => router.push('/week-plan')}
        style={[styles.weekAheadCta, shadows.card]}
      >
        <View style={styles.weekAheadIcon}>
          <Ionicons name="calendar-outline" size={20} color={colors.onBrandPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weekAheadTitle}>See the week ahead</Text>
          <Text style={styles.weekAheadSub}>Preview meals & workouts for Nov 20 – 26</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={colors.onBrandPrimary} />
      </Pressable>

      <Text style={styles.sectionTitle}>Daily progress</Text>
      <View style={[styles.weekChart, shadows.card]}>
        {weekSummary.days.map((d, i) => (
          <View key={i} style={styles.weekCol}>
            <Text style={styles.weekKcal}>{d.kcal > 0 ? `${(d.kcal / 1000).toFixed(1)}k` : '—'}</Text>
            <View style={styles.weekBarWrap}>
              <View style={[
                styles.weekBar,
                { height: `${(d.habits / maxH) * 100}%`, backgroundColor: d.today ? colors.warning : d.habits >= 5 ? colors.brand : colors.brandSecondary },
                d.habits === 0 && { backgroundColor: colors.surfaceTertiary, height: '8%' },
              ]} />
            </View>
            <Text style={[styles.weekDayLbl, d.today && { color: colors.brand, fontWeight: font.bold }]}>{d.label}</Text>
            {d.workout && <View style={styles.weekWorkoutDot} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Breakdown</Text>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={[styles.weekStatCard, shadows.card]}>
          <View style={styles.statIcon}><Ionicons name="barbell-outline" size={16} color={colors.brand} /></View>
          <Text style={styles.weekStatValue}>{weekSummary.totals.workouts}</Text>
          <Text style={styles.weekStatLabel}>Workouts</Text>
          <Text style={styles.weekStatDelta}>+1 vs last week</Text>
        </View>
        <View style={[styles.weekStatCard, shadows.card]}>
          <View style={[styles.statIcon, { backgroundColor: '#FBE7D6' }]}><Ionicons name="restaurant-outline" size={16} color="#8A4A20" /></View>
          <Text style={styles.weekStatValue}>{weekSummary.totals.mealsLogged}</Text>
          <Text style={styles.weekStatLabel}>Meals logged</Text>
          <Text style={styles.weekStatDelta}>+3 vs last week</Text>
        </View>
        <View style={[styles.weekStatCard, shadows.card]}>
          <View style={styles.statIcon}><Ionicons name="checkmark-circle-outline" size={16} color={colors.brand} /></View>
          <Text style={styles.weekStatValue}>{Math.round((weekSummary.totals.habitsDone / weekSummary.totals.habitsTarget) * 100)}%</Text>
          <Text style={styles.weekStatLabel}>Habit rate</Text>
          <Text style={styles.weekStatDelta}>+8% vs last week</Text>
        </View>
      </View>
    </>
  );
}

function MonthView() {
  const weeks = [
    monthHeatmap.slice(0, 7),
    monthHeatmap.slice(7, 14),
    monthHeatmap.slice(14, 21),
    monthHeatmap.slice(21, 28),
    monthHeatmap.slice(28, 30),
  ];
  const active = monthHeatmap.filter((v) => v > 0).length;
  const perfect = monthHeatmap.filter((v) => v >= 4).length;

  return (
    <>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={[styles.monthStat, shadows.card]}>
          <Text style={styles.monthStatValue}>{active}</Text>
          <Text style={styles.monthStatLabel}>Active days</Text>
        </View>
        <View style={[styles.monthStat, shadows.card]}>
          <Text style={styles.monthStatValue}>{perfect}</Text>
          <Text style={styles.monthStatLabel}>Perfect days</Text>
        </View>
        <View style={[styles.monthStat, shadows.card]}>
          <Text style={styles.monthStatValue}>12</Text>
          <Text style={styles.monthStatLabel}>Best streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Activity heatmap</Text>
      <View style={[styles.heatmapCard, shadows.card]}>
        <View style={styles.dayHeader}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <Text key={i} style={styles.dayHeaderText}>{d}</Text>
          ))}
        </View>
        {weeks.map((wk, wi) => (
          <View key={wi} style={styles.heatRow}>
            {wk.map((v, di) => (
              <View key={di} style={[styles.heatCell, { backgroundColor: heatColor(v) }]}>
                <Text style={[styles.heatCellText, v >= 3 && { color: '#FFF' }]}>{wi * 7 + di + 1}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.heatLegend}>
          <Text style={styles.heatLegendLbl}>Less</Text>
          {[0, 1, 2, 3, 4].map((v) => (
            <View key={v} style={[styles.heatCell, styles.heatLegendCell, { backgroundColor: heatColor(v) }]} />
          ))}
          <Text style={styles.heatLegendLbl}>More</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Monthly wins</Text>
      <View style={[styles.monthWinBox, shadows.card]}>
        <View style={styles.monthWinRow}>
          <Ionicons name="trophy" size={16} color="#D18E62" />
          <Text style={styles.monthWinText}>Completed <Text style={{ fontWeight: font.bold }}>{perfect} perfect days</Text> — up from 3 last month</Text>
        </View>
        <View style={styles.monthWinRow}>
          <Ionicons name="trending-down" size={16} color={colors.brand} />
          <Text style={styles.monthWinText}>Average <Text style={{ fontWeight: font.bold }}>resting HR down 4 bpm</Text></Text>
        </View>
        <View style={styles.monthWinRow}>
          <Ionicons name="walk" size={16} color={colors.brand} />
          <Text style={styles.monthWinText}><Text style={{ fontWeight: font.bold }}>240k steps</Text> · +18% over October</Text>
        </View>
      </View>
    </>
  );
}

function heatColor(v: number): string {
  const map = ['#F2F2F0', '#E3EBE6', '#B9D7C4', '#88A392', '#5A7D66'];
  return map[Math.min(v, 4)];
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroPill}>
      <Text style={styles.macroLbl}>{label}</Text>
      <Text style={styles.macroVal}>{value}</Text>
    </View>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <View style={[styles.statCard, shadows.card]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={16} color={colors.brand} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  stickyHeader: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: { fontSize: 28, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.6 },
  sub: { fontSize: type.base, color: colors.onSurfaceSecondary, marginTop: 2 },
  dateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  dateText: { fontSize: 12, fontWeight: font.bold, color: colors.brand },

  tabsRow: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md, paddingBottom: spacing.md,
  },
  tabBtn: {
    flex: 1, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: colors.brand },
  tabLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurfaceSecondary },

  rangeRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    padding: 3,
  },
  rangeBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 9,
    alignItems: 'center',
  },
  rangeBtnActive: { backgroundColor: colors.surfaceSecondary, ...shadows.card },
  rangeLabel: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurfaceSecondary },

  weekChart: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    height: 160,
  },
  weekCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  weekKcal: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.semibold },
  weekBarWrap: { width: 22, height: 90, backgroundColor: colors.surfaceTertiary, borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  weekBar: { width: '100%', borderRadius: 6 },
  weekDayLbl: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.semibold, marginTop: 2 },
  weekWorkoutDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.brand },

  weekStatCard: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  weekStatValue: { fontSize: 22, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.4, marginTop: 6 },
  weekStatLabel: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.semibold },
  weekStatDelta: { fontSize: 10, color: colors.brand, fontWeight: font.bold, marginTop: 2 },

  monthStat: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  monthStatValue: { fontSize: 26, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.5 },
  monthStatLabel: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.semibold, marginTop: 4 },

  heatmapCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  dayHeaderText: { flex: 1, textAlign: 'center', fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.bold, letterSpacing: 0.4 },
  heatRow: { flexDirection: 'row', gap: 4 },
  heatCell: {
    flex: 1, aspectRatio: 1, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  heatCellText: { fontSize: 10, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  heatLegend: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: spacing.md, justifyContent: 'flex-end',
  },
  heatLegendLbl: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  heatLegendCell: { width: 14, height: 14, aspectRatio: undefined, flex: undefined as any },

  monthWinBox: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary, gap: 10,
  },
  monthWinRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  monthWinText: { flex: 1, fontSize: 12, color: colors.onBrandTertiary, lineHeight: 18 },

  weekAheadCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.brand,
  },
  weekAheadIcon: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  weekAheadTitle: { color: colors.onBrandPrimary, fontSize: type.base, fontWeight: font.bold, letterSpacing: -0.2 },
  weekAheadSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, fontWeight: font.medium, marginTop: 2 },

  body: { padding: spacing.lg, gap: spacing.md },

  progressCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  progressEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.4 },
  progressTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, marginTop: 4, letterSpacing: -0.3 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  streakText: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.medium },

  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginTop: spacing.md },

  list: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  habitRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  habitCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  habitCheckDone: { backgroundColor: colors.brand, borderColor: colors.brand },
  habitIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  habitTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  habitTitleDone: { color: colors.onSurfaceSecondary, textDecorationLine: 'line-through' },
  habitMeta: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },

  catPill: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999,
  },
  cat_diet: { backgroundColor: '#FBE7D6' },
  cat_workout: { backgroundColor: colors.brandTertiary },
  cat_wellness: { backgroundColor: colors.surfaceTertiary },
  catText: { fontSize: 10, fontWeight: font.bold, color: colors.onSurface, textTransform: 'capitalize' },

  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statCard: {
    flex: 1, padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border,
    gap: 6,
  },
  statIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 20, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginTop: 4 },
  statLabel: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },

  summaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
  },
  summaryLabel: { fontSize: 11, color: colors.onBrandTertiary, fontWeight: font.bold, letterSpacing: 1.2 },
  summaryValue: { fontSize: 32, fontWeight: font.bold, color: colors.onBrandTertiary, letterSpacing: -0.8, marginTop: 4 },
  summaryUnit: { fontSize: 14, fontWeight: font.medium, color: colors.onBrandTertiary },
  summarySub: { fontSize: 12, color: colors.onBrandTertiary, marginTop: 4, opacity: 0.85 },
  macroCol: { gap: 6 },
  macroPill: { flexDirection: 'row', gap: 8, backgroundColor: colors.surfaceSecondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignItems: 'center' },
  macroLbl: { fontSize: 11, fontWeight: font.bold, color: colors.brand },
  macroVal: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurface },

  mealCard: {
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  mealHead: { flexDirection: 'row', alignItems: 'center' },
  mealTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  mealMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  smallBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  mealItems: { marginTop: spacing.md, gap: 8, paddingLeft: 32 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bullet: { width: 5, height: 5, borderRadius: 999, backgroundColor: colors.brand },
  itemText: { fontSize: type.base, color: colors.onSurface, flex: 1 },

  workoutCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  workoutIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  workoutTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  workoutMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  playBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
});
