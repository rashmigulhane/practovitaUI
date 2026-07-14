import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import AskFab from '@/src/components/AskFab';
import CustomizeSheet from '@/src/components/CustomizeSheet';
import {
  mealOptions,
  weeklyWorkoutSchedule,
  alternativeWorkouts,
  weeklyHabits,
  weekMeta,
} from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

type Tab = 'diet' | 'workout' | 'habits';

const CATEGORY_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snacks',
  dinner: 'Dinner',
} as const;

const CATEGORY_ICONS = {
  breakfast: 'sunny-outline',
  lunch: 'restaurant-outline',
  snack: 'cafe-outline',
  dinner: 'moon-outline',
} as const;

export default function PlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ generated?: string }>();
  const [tab, setTab] = useState<Tab>('diet');
  const [expandedDay, setExpandedDay] = useState<string | null>(
    weeklyWorkoutSchedule.find((d) => d.isToday)?.id ?? null
  );
  const [custOpen, setCustOpen] = useState(false);
  const [hasSetPrefs] = useState<boolean>(!!params.generated || false);

  const toggleDay = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setExpandedDay((x) => (x === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Sticky header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Weekly plan</Text>
            <Text style={styles.pageSub}>
              Week {weekMeta.weekNum} · {weekMeta.range}
            </Text>
          </View>
          <Pressable
            testID="customize-btn"
            onPress={() => setCustOpen(true)}
            style={styles.custBtn}
          >
            <Ionicons name="options-outline" size={16} color={colors.brand} />
            <Text style={styles.custBtnText}>Customize</Text>
          </Pressable>
        </View>

        {/* Focus banner */}
        <View style={styles.focusRow}>
          <Ionicons name="leaf" size={12} color={colors.brand} />
          <Text style={styles.focusText}>{weekMeta.focus}</Text>
          <View style={styles.focusDivider} />
          <Text style={styles.focusStat}>{weekMeta.workoutsCount} workouts</Text>
          <View style={styles.focusDivider} />
          <Text style={styles.focusStat}>~{weekMeta.avgKcal} kcal/day</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TabBtn label="Diet" active={tab === 'diet'} onPress={() => setTab('diet')} testID="tab-diet" />
          <TabBtn label="Workouts" active={tab === 'workout'} onPress={() => setTab('workout')} testID="tab-workout" />
          <TabBtn label="Habits" active={tab === 'habits'} onPress={() => setTab('habits')} testID="tab-habits" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!hasSetPrefs && (
          <Pressable
            testID="setup-prefs-card"
            onPress={() => router.push('/plan-preferences')}
            style={[styles.setupCard, shadows.card]}
          >
            <View style={styles.setupIcon}>
              <Ionicons name="sparkles" size={20} color={colors.onBrandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.setupTitle}>Personalise your plan</Text>
              <Text style={styles.setupSub}>Tell us your food & workout preferences in 60 sec</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={colors.brand} />
          </Pressable>
        )}

        {tab === 'diet' && <DietView />}
        {tab === 'workout' && <WorkoutView expandedDay={expandedDay} onToggle={toggleDay} />}
        {tab === 'habits' && <HabitsView />}

        <View style={{ height: 100 }} />
      </ScrollView>

      <AskFab bottom={100} />
      <CustomizeSheet visible={custOpen} onClose={() => setCustOpen(false)} />
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

/* ---------- Diet View ---------- */
function DietView() {
  return (
    <View style={{ gap: spacing.xl }}>
      {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((cat) => {
        const items = mealOptions[cat];
        return (
          <View key={cat}>
            <View style={styles.mealHead}>
              <View style={styles.mealHeadLeft}>
                <View style={styles.mealHeadIcon}>
                  <Ionicons name={CATEGORY_ICONS[cat] as any} size={16} color={colors.brand} />
                </View>
                <View>
                  <Text style={styles.mealTitle}>{CATEGORY_LABELS[cat]}</Text>
                  <Text style={styles.mealCount}>{items.length} options for the week</Text>
                </View>
              </View>
              <Pressable testID={`see-all-${cat}`}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealScroll}>
              {items.map((m) => (
                <View key={m.id} style={[styles.mealCard, shadows.card]}>
                  <View style={styles.mealCardTop}>
                    <View style={styles.tagPill}>
                      <Text style={styles.tagText}>{m.tag}</Text>
                    </View>
                    <View style={styles.prepChip}>
                      <Ionicons name="time-outline" size={10} color={colors.onSurfaceSecondary} />
                      <Text style={styles.prepText}>{m.prepMin}m</Text>
                    </View>
                  </View>
                  <Text style={styles.mealName} numberOfLines={2}>{m.name}</Text>
                  <Text style={styles.mealCuisine}>{m.cuisine}</Text>
                  <View style={styles.macrosRow}>
                    <Text style={styles.kcal}>{m.kcal} <Text style={styles.kcalUnit}>kcal</Text></Text>
                    <View style={styles.macros}>
                      <Text style={styles.macro}>P {m.protein}</Text>
                      <Text style={styles.macro}>C {m.carbs}</Text>
                      <Text style={styles.macro}>F {m.fat}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

/* ---------- Workout View ---------- */
function WorkoutView({ expandedDay, onToggle }: any) {
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={styles.sectionTitle}>This week{'\u2019'}s schedule</Text>

      {weeklyWorkoutSchedule.map((d) => (
        <WorkoutDayCard key={d.id} day={d} expanded={d.id === expandedDay} onToggle={() => onToggle(d.id)} />
      ))}

      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Alternative workouts</Text>
      <Text style={styles.sectionSub}>Swap any scheduled workout with one of these</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.altScroll}>
        {alternativeWorkouts.map((a) => (
          <View key={a.title} style={[styles.altCard, shadows.card]}>
            <View style={styles.altIcon}>
              <Ionicons name={a.icon as any} size={18} color={colors.brand} />
            </View>
            <Text style={styles.altTitle}>{a.title}</Text>
            <Text style={styles.altMeta}>{a.duration} · {a.intensity}</Text>
            <Text style={styles.altFocus}>{a.focus}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function WorkoutDayCard({ day, expanded, onToggle }: any) {
  return (
    <View style={[styles.workoutDay, shadows.card, day.isToday && styles.workoutDayToday]}>
      <Pressable testID={`wo-day-${day.id}`} onPress={onToggle} style={styles.workoutHead}>
        <View style={[styles.dateBox, day.isToday && { backgroundColor: colors.brand }]}>
          <Text style={[styles.dateNum, day.isToday && { color: colors.onBrandPrimary }]}>{day.date}</Text>
          <Text style={[styles.dateShort, day.isToday && { color: colors.onBrandPrimary, opacity: 0.9 }]}>{day.short.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.workoutHeadRow}>
            <Text style={styles.workoutDayName}>{day.day}</Text>
            {day.isToday && <View style={styles.todayPill}><Text style={styles.todayPillText}>TODAY</Text></View>}
          </View>
          {day.workout ? (
            <>
              <Text style={styles.workoutName}>{day.workout.title}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.miniBadge}>
                  <Ionicons name="time-outline" size={10} color={colors.onSurfaceSecondary} />
                  <Text style={styles.miniBadgeText}>{day.workout.duration}</Text>
                </View>
                <View style={styles.miniBadge}>
                  <Ionicons name="flash-outline" size={10} color={colors.onSurfaceSecondary} />
                  <Text style={styles.miniBadgeText}>{day.workout.intensity}</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: colors.brandTertiary }]}>
                  <Text style={[styles.miniBadgeText, { color: colors.brand, fontWeight: font.bold }]}>{day.workout.focus}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.restRow}>
              <Ionicons name="bed-outline" size={14} color="#8A4A20" />
              <Text style={styles.restText}>Rest & recover · Focus on stretching + hydration</Text>
            </View>
          )}
        </View>
        {day.workout && (
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.onSurfaceSecondary} />
        )}
      </Pressable>

      {expanded && day.workout && (
        <View style={styles.workoutExpand}>
          <View style={styles.howtoBox}>
            <Text style={styles.howtoLabel}>HOW TO PERFORM</Text>
            <Text style={styles.howtoText}>{day.workout.howto}</Text>
          </View>

          <Text style={styles.exListTitle}>Exercises</Text>
          <View style={styles.exList}>
            {day.workout.exercises.map((e: any, i: number) => (
              <View key={i} style={styles.exRow}>
                <View style={styles.exNum}><Text style={styles.exNumText}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exName}>{e.name}</Text>
                  <View style={styles.exMetaRow}>
                    {e.sets && (
                      <View style={styles.exMeta}>
                        <Text style={styles.exMetaLbl}>SETS</Text>
                        <Text style={styles.exMetaVal}>{e.sets}</Text>
                      </View>
                    )}
                    {e.reps && (
                      <View style={styles.exMeta}>
                        <Text style={styles.exMetaLbl}>REPS</Text>
                        <Text style={styles.exMetaVal}>{e.reps}</Text>
                      </View>
                    )}
                    {e.duration && (
                      <View style={styles.exMeta}>
                        <Text style={styles.exMetaLbl}>TIME</Text>
                        <Text style={styles.exMetaVal}>{e.duration}</Text>
                      </View>
                    )}
                    {e.rest && (
                      <View style={styles.exMeta}>
                        <Text style={styles.exMetaLbl}>REST</Text>
                        <Text style={styles.exMetaVal}>{e.rest}</Text>
                      </View>
                    )}
                  </View>
                  {e.notes && <Text style={styles.exNotes}>{e.notes}</Text>}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.workoutActions}>
            <Pressable testID={`swap-workout-${day.id}`} style={styles.actionGhost}>
              <Ionicons name="swap-horizontal-outline" size={14} color={colors.brand} />
              <Text style={styles.actionGhostText}>Swap</Text>
            </Pressable>
            <Pressable testID={`start-workout-${day.id}`} style={styles.actionPrimary}>
              <Ionicons name="play" size={14} color={colors.onBrandPrimary} />
              <Text style={styles.actionPrimaryText}>Start workout</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ---------- Habits View ---------- */
function HabitsView() {
  const [state, setState] = useState(weeklyHabits);
  const totalDone = state.reduce((s, h) => s + h.weekProgress.filter(Boolean).length, 0);
  const totalTarget = state.reduce((s, h) => s + h.weekProgress.length, 0);

  const toggle = (id: string, dayIdx: number) => {
    Haptics.selectionAsync().catch(() => {});
    setState((prev) => prev.map((h) => (h.id === id ? { ...h, weekProgress: h.weekProgress.map((v, i) => (i === dayIdx ? !v : v)) } : h)));
  };

  return (
    <View style={{ gap: spacing.md }}>
      <View style={[styles.habitsHero, shadows.card]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.habitsHeroEyebrow}>WEEK PROGRESS</Text>
          <Text style={styles.habitsHeroValue}>{totalDone} / {totalTarget}</Text>
          <Text style={styles.habitsHeroSub}>habits completed this week</Text>
        </View>
        <View style={styles.habitsRing}>
          <Text style={styles.habitsRingText}>{Math.round((totalDone / totalTarget) * 100)}%</Text>
        </View>
      </View>

      <View style={styles.dayHeaderRow}>
        <View style={{ width: '48%' }} />
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <Text key={i} style={styles.dayHeaderText}>{d}</Text>
        ))}
      </View>

      <View style={[styles.habitsList, shadows.card]}>
        {state.map((h, i) => (
          <View key={h.id} style={[styles.habitRow, i < state.length - 1 && styles.habitBorder]}>
            <View style={styles.habitLeft}>
              <View style={styles.habitIcon}>
                <Ionicons name={h.icon as any} size={16} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.habitTitle}>{h.title}</Text>
                <Text style={styles.habitFreq}>{h.frequency} · {h.target}</Text>
              </View>
            </View>
            <View style={styles.checkGrid}>
              {h.weekProgress.map((done, di) => (
                <Pressable
                  key={di}
                  testID={`habit-${h.id}-day-${di}`}
                  onPress={() => toggle(h.id, di)}
                  style={[styles.checkCell, done && styles.checkCellDone]}
                  hitSlop={4}
                >
                  {done && <Ionicons name="checkmark" size={10} color={colors.onBrandPrimary} />}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
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
  pageTitle: { fontSize: 26, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.5 },
  pageSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2, fontWeight: font.medium },
  custBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  custBtnText: { color: colors.brand, fontSize: 12, fontWeight: font.bold },

  focusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
  },
  focusText: { fontSize: 11, color: colors.brand, fontWeight: font.bold, letterSpacing: 0.2 },
  focusDivider: { width: 3, height: 3, borderRadius: 999, backgroundColor: colors.onSurfaceSecondary, marginHorizontal: 4, opacity: 0.6 },
  focusStat: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.semibold },

  tabsRow: {
    flexDirection: 'row', gap: 6, padding: 3,
    marginHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.surfaceTertiary,
  },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.brand },
  tabLabel: { fontSize: 13, fontWeight: font.bold, color: colors.onSurfaceSecondary },

  body: { padding: spacing.lg, gap: spacing.lg },

  setupCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
    borderWidth: 1, borderColor: colors.brandSecondary + '55',
  },
  setupIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  setupTitle: { fontSize: type.base, fontWeight: font.bold, color: colors.onBrandTertiary },
  setupSub: { fontSize: 12, color: colors.onBrandTertiary, opacity: 0.85, marginTop: 2 },

  /* Diet */
  mealHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  mealHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  mealHeadIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  mealTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  mealCount: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2, fontWeight: font.medium },
  seeAll: { fontSize: 12, color: colors.brand, fontWeight: font.bold },

  mealScroll: { gap: spacing.md, paddingRight: spacing.lg },
  mealCard: {
    width: 200, padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  mealCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagPill: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  tagText: { fontSize: 10, fontWeight: font.bold, color: colors.brand, letterSpacing: 0.2 },
  prepChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  prepText: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.semibold },
  mealName: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, marginTop: 10, letterSpacing: -0.2 },
  mealCuisine: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 3, fontWeight: font.medium },
  macrosRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  kcal: { fontSize: 18, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  kcalUnit: { fontSize: 10, fontWeight: font.medium, color: colors.onSurfaceSecondary },
  macros: { flexDirection: 'row', gap: 8 },
  macro: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.bold },

  /* Workouts */
  sectionTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  sectionSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: -8, marginBottom: spacing.sm, fontWeight: font.medium },

  workoutDay: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  workoutDayToday: { borderColor: colors.brand, borderWidth: 1.5 },
  workoutHead: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  dateBox: {
    width: 48, height: 56, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  dateNum: { fontSize: 20, fontWeight: font.bold, color: colors.onBrandTertiary, letterSpacing: -0.4 },
  dateShort: { fontSize: 9, fontWeight: font.bold, color: colors.brand, letterSpacing: 1, marginTop: 1 },
  workoutHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  workoutDayName: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  todayPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.brand },
  todayPillText: { fontSize: 9, color: colors.onBrandPrimary, fontWeight: font.bold, letterSpacing: 0.5 },
  workoutName: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, marginTop: 2, letterSpacing: -0.2 },
  workoutMeta: { flexDirection: 'row', gap: 5, marginTop: 6, flexWrap: 'wrap' },
  miniBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 999, backgroundColor: colors.surfaceTertiary,
  },
  miniBadgeText: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.semibold },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  restText: { fontSize: 12, color: '#8A4A20', fontWeight: font.medium },

  workoutExpand: {
    padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider,
    gap: spacing.md,
  },
  howtoBox: {
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
  },
  howtoLabel: { fontSize: 10, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.2 },
  howtoText: { fontSize: 12, color: colors.onBrandTertiary, lineHeight: 18, marginTop: 4 },
  exListTitle: { fontSize: 12, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1, textTransform: 'uppercase' },
  exList: { gap: spacing.sm },
  exRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  exNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  exNumText: { fontSize: 11, fontWeight: font.bold, color: colors.onSurface },
  exName: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurface },
  exMetaRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  exMeta: { alignItems: 'flex-start' },
  exMetaLbl: { fontSize: 9, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 0.8 },
  exMetaVal: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface },
  exNotes: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 4, fontStyle: 'italic' },

  workoutActions: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  actionGhost: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.brand,
  },
  actionGhostText: { fontSize: 12, fontWeight: font.bold, color: colors.brand },
  actionPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.brand,
  },
  actionPrimaryText: { fontSize: 12, fontWeight: font.bold, color: colors.onBrandPrimary },

  altScroll: { gap: spacing.sm, paddingRight: spacing.lg },
  altCard: {
    width: 140, padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  altIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  altTitle: { fontSize: 13, fontWeight: font.bold, color: colors.onSurface },
  altMeta: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  altFocus: { fontSize: 10, color: colors.brand, fontWeight: font.bold, marginTop: 2 },

  /* Habits */
  habitsHero: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
  },
  habitsHeroEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.2 },
  habitsHeroValue: { fontSize: 32, fontWeight: font.bold, color: colors.onBrandTertiary, letterSpacing: -0.8, marginTop: 4 },
  habitsHeroSub: { fontSize: 12, color: colors.onBrandTertiary, marginTop: 2, opacity: 0.85 },
  habitsRing: {
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 6, borderColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  habitsRingText: { fontSize: 14, fontWeight: font.bold, color: colors.brand },

  dayHeaderRow: { flexDirection: 'row', paddingLeft: spacing.md, gap: 0, marginTop: 4, marginBottom: -6 },
  dayHeaderText: { flex: 1, textAlign: 'center', fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.bold, letterSpacing: 0.4 },

  habitsList: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  habitBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  habitLeft: { width: '46%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitIcon: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  habitTitle: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurface, lineHeight: 15 },
  habitFreq: { fontSize: 10, color: colors.onSurfaceSecondary, marginTop: 2, fontWeight: font.medium },

  checkGrid: { flex: 1, flexDirection: 'row', gap: 3, justifyContent: 'space-between' },
  checkCell: {
    flex: 1, aspectRatio: 1, borderRadius: 5,
    borderWidth: 1, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    minWidth: 22, maxWidth: 26,
  },
  checkCellDone: { backgroundColor: colors.brand, borderColor: colors.brand },
});
