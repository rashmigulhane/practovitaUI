import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import ScreenHeader from '@/src/components/ScreenHeader';
import AskFab from '@/src/components/AskFab';
import { weekAheadPlan, type WeekDay, type PlannedMeal } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const SLOT_META: Record<PlannedMeal['slot'], { label: string; icon: string; tint: string; text: string }> = {
  B: { label: 'Breakfast', icon: 'sunny-outline', tint: '#FBE7D6', text: '#8A4A20' },
  L: { label: 'Lunch', icon: 'restaurant-outline', tint: '#E3EBE6', text: '#3E5C4A' },
  S: { label: 'Snack', icon: 'cafe-outline', tint: '#F2F2F0', text: '#40403C' },
  D: { label: 'Dinner', icon: 'moon-outline', tint: '#F6DAD5', text: '#7A2E29' },
};

export default function WeekPlanScreen() {
  const router = useRouter();
  const [expandedKey, setExpandedKey] = useState<string>(weekAheadPlan.days[0].key);
  const [weekOffset, setWeekOffset] = useState(0);

  const shiftWeek = (dir: 1 | -1) => {
    Haptics.selectionAsync().catch(() => {});
    setWeekOffset((w) => w + dir);
  };

  const toggle = (key: string) => {
    Haptics.selectionAsync().catch(() => {});
    setExpandedKey((k) => (k === key ? '' : key));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Week ahead" subtitle="Your planned meals & workouts" showBack rightIcon="share-outline" />

      {/* Week range switcher */}
      <View style={styles.weekBar}>
        <Pressable testID="week-prev" onPress={() => shiftWeek(-1)} style={styles.arrowBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={18} color={colors.onSurface} />
        </Pressable>
        <View style={styles.weekLabelBox}>
          <Text style={styles.weekRange}>{weekAheadPlan.range}</Text>
          <Text style={styles.weekOffset}>
            {weekOffset === 0 ? 'This week' : weekOffset > 0 ? `${weekOffset} week${weekOffset > 1 ? 's' : ''} ahead` : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago`}
          </Text>
        </View>
        <Pressable testID="week-next" onPress={() => shiftWeek(1)} style={styles.arrowBtn} hitSlop={12}>
          <Ionicons name="chevron-forward" size={18} color={colors.onSurface} />
        </Pressable>
      </View>

      {/* Summary hero */}
      <LinearGradient
        colors={['#5A7D66', '#3E5C4A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, shadows.card]}
      >
        <View style={styles.heroTop}>
          <Text style={styles.heroEyebrow}>THIS WEEK{'\u2019'}S FOCUS</Text>
          <Text style={styles.heroFocus}>{weekAheadPlan.focus}</Text>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Ionicons name="barbell-outline" size={14} color="#FFF" />
            <Text style={styles.heroStatValue}>{weekAheadPlan.totals.workouts}</Text>
            <Text style={styles.heroStatLabel}>Workouts</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Ionicons name="flame-outline" size={14} color="#FFF" />
            <Text style={styles.heroStatValue}>{weekAheadPlan.totals.avgKcal}</Text>
            <Text style={styles.heroStatLabel}>Avg kcal/day</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Ionicons name="water-outline" size={14} color="#FFF" />
            <Text style={styles.heroStatValue}>{weekAheadPlan.totals.waterTarget}</Text>
            <Text style={styles.heroStatLabel}>Hydration</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Day pill selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRail}
      >
        {weekAheadPlan.days.map((d) => {
          const active = d.key === expandedKey;
          return (
            <Pressable
              key={d.key}
              testID={`day-pill-${d.key}`}
              onPress={() => toggle(d.key)}
              style={[styles.dayPill, active && styles.dayPillActive, d.isToday && !active && styles.dayPillToday]}
            >
              <Text style={[styles.dayPillShort, active && { color: colors.onBrandPrimary }, d.isToday && !active && { color: colors.brand }]}>
                {d.short}
              </Text>
              <Text style={[styles.dayPillDate, active && { color: colors.onBrandPrimary }, d.isToday && !active && { color: colors.brand }]}>
                {d.date}
              </Text>
              {d.isRest && !active && <View style={styles.restDot} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {weekAheadPlan.days.map((d) => (
          <DayCard
            key={d.key}
            day={d}
            expanded={d.key === expandedKey}
            onToggle={() => toggle(d.key)}
            onOpen={() => router.push('/recommendations')}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <AskFab bottom={40} />
    </SafeAreaView>
  );
}

function DayCard({ day, expanded, onToggle, onOpen }: { day: WeekDay; expanded: boolean; onToggle: () => void; onOpen: () => void }) {
  const totalKcal = day.meals.reduce((s, m) => s + m.kcal, 0);
  return (
    <View style={[styles.dayCard, shadows.card, day.isToday && styles.dayCardToday]}>
      <Pressable testID={`day-card-${day.key}`} onPress={onToggle} style={styles.dayCardHead}>
        <View style={[styles.dateBox, day.isToday && { backgroundColor: colors.brand }]}>
          <Text style={[styles.dateBoxNum, day.isToday && { color: colors.onBrandPrimary }]}>{day.date}</Text>
          <Text style={[styles.dateBoxDay, day.isToday && { color: colors.onBrandPrimary, opacity: 0.9 }]}>
            {day.short.toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.dayHeadRow}>
            <Text style={styles.dayName}>{day.label}</Text>
            {day.isToday && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>TODAY</Text>
              </View>
            )}
          </View>
          <View style={styles.daySubRow}>
            <View style={styles.dayMetaBadge}>
              <Ionicons name="flame-outline" size={11} color={colors.onSurfaceSecondary} />
              <Text style={styles.dayMetaText}>{totalKcal} kcal</Text>
            </View>
            {day.workout ? (
              <View style={[styles.dayMetaBadge, { backgroundColor: colors.brandTertiary }]}>
                <Ionicons name={day.workout.icon as any} size={11} color={colors.brand} />
                <Text style={[styles.dayMetaText, { color: colors.brand, fontWeight: font.bold }]}>{day.workout.duration}</Text>
              </View>
            ) : (
              <View style={[styles.dayMetaBadge, { backgroundColor: '#FBE7D6' }]}>
                <Ionicons name="bed-outline" size={11} color="#8A4A20" />
                <Text style={[styles.dayMetaText, { color: '#8A4A20', fontWeight: font.bold }]}>Rest day</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.onSurfaceSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.expandedBody}>
          {/* Diet section */}
          <View style={styles.sectionRow}>
            <Ionicons name="restaurant-outline" size={14} color={colors.brand} />
            <Text style={styles.sectionRowText}>Meals</Text>
            <View style={styles.sectionLine} />
          </View>
          {day.meals.map((meal) => {
            const meta = SLOT_META[meal.slot];
            return (
              <View key={meal.slot} style={styles.mealRow}>
                <View style={[styles.mealSlot, { backgroundColor: meta.tint }]}>
                  <Ionicons name={meta.icon as any} size={12} color={meta.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealSlotLabel}>{meta.label}</Text>
                  <Text style={styles.mealName}>{meal.name}</Text>
                </View>
                <View style={styles.mealRight}>
                  <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
                  <View style={styles.mealTag}>
                    <Text style={styles.mealTagText}>{meal.tag}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Workout section */}
          <View style={styles.sectionRow}>
            <Ionicons name="barbell-outline" size={14} color={colors.brand} />
            <Text style={styles.sectionRowText}>Workout</Text>
            <View style={styles.sectionLine} />
          </View>
          {day.workout ? (
            <View style={styles.workoutBlock}>
              <View style={styles.workoutIcon}>
                <Ionicons name={day.workout.icon as any} size={20} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutTitle}>{day.workout.title}</Text>
                <Text style={styles.workoutMeta}>{day.workout.duration} · {day.workout.intensity} intensity</Text>
              </View>
              <Pressable testID={`start-${day.key}`} style={styles.playBtn}>
                <Ionicons name="play" size={16} color={colors.onBrandPrimary} />
              </Pressable>
            </View>
          ) : (
            <View style={[styles.workoutBlock, { backgroundColor: '#FBE7D6' }]}>
              <View style={[styles.workoutIcon, { backgroundColor: 'rgba(138,74,32,0.15)' }]}>
                <Ionicons name="bed-outline" size={20} color="#8A4A20" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.workoutTitle, { color: '#8A4A20' }]}>Rest & recover</Text>
                <Text style={[styles.workoutMeta, { color: '#8A4A20', opacity: 0.85 }]}>Focus on hydration & stretching</Text>
              </View>
            </View>
          )}

          <Pressable testID={`open-${day.key}`} onPress={onOpen} style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>View full day details</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  weekBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  arrowBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  weekLabelBox: { alignItems: 'center' },
  weekRange: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  weekOffset: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2, fontWeight: font.medium },

  hero: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg, borderRadius: radius.lg,
  },
  heroTop: { marginBottom: spacing.md },
  heroEyebrow: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: font.bold, letterSpacing: 1.6 },
  heroFocus: { color: '#FFF', fontSize: type.xl, fontWeight: font.bold, marginTop: 6, letterSpacing: -0.3 },
  heroStats: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  heroStat: { flex: 1, alignItems: 'flex-start', gap: 2 },
  heroStatValue: { color: '#FFF', fontSize: type.xl, fontWeight: font.bold, letterSpacing: -0.4, marginTop: 4 },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: font.semibold, letterSpacing: 0.4 },
  heroDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)' },

  dayRail: {
    paddingHorizontal: spacing.lg, gap: spacing.sm,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  dayPill: {
    width: 52, paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', flexShrink: 0, gap: 2,
  },
  dayPillActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  dayPillToday: { borderColor: colors.brand, borderWidth: 1.5 },
  dayPillShort: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.bold, letterSpacing: 0.6 },
  dayPillDate: { fontSize: 18, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  restDot: {
    position: 'absolute', top: 6, right: 8,
    width: 5, height: 5, borderRadius: 3, backgroundColor: '#D18E62',
  },

  body: { paddingHorizontal: spacing.lg, paddingTop: 0, gap: spacing.md },

  dayCard: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  dayCardToday: { borderColor: colors.brand, borderWidth: 1.5 },
  dayCardHead: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  dateBox: {
    width: 52, height: 60, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  dateBoxNum: { fontSize: 22, fontWeight: font.bold, color: colors.onBrandTertiary, letterSpacing: -0.4 },
  dateBoxDay: { fontSize: 9, fontWeight: font.bold, color: colors.brand, letterSpacing: 1, marginTop: 1 },
  dayHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayName: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  todayBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  todayBadgeText: { fontSize: 9, fontWeight: font.bold, color: colors.onBrandPrimary, letterSpacing: 0.6 },
  daySubRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  dayMetaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: colors.surfaceTertiary,
  },
  dayMetaText: { fontSize: 11, fontWeight: font.semibold, color: colors.onSurfaceSecondary },

  expandedBody: {
    borderTopWidth: 1, borderTopColor: colors.divider,
    padding: spacing.md, gap: spacing.sm,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  sectionRowText: { fontSize: 11, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.divider, marginLeft: 6 },

  mealRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 6,
  },
  mealSlot: {
    width: 28, height: 28, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  mealSlotLabel: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 0.8 },
  mealName: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurface, marginTop: 1 },
  mealRight: { alignItems: 'flex-end', gap: 3 },
  mealKcal: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface },
  mealTag: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  mealTagText: { fontSize: 9, fontWeight: font.bold, color: colors.brand },

  workoutBlock: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    marginTop: 4,
  },
  workoutIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  workoutTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onBrandTertiary },
  workoutMeta: { fontSize: 12, color: colors.onBrandTertiary, opacity: 0.85, marginTop: 2 },
  playBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },

  detailBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, marginTop: 4,
  },
  detailBtnText: { fontSize: 13, fontWeight: font.bold, color: colors.brand },
});
