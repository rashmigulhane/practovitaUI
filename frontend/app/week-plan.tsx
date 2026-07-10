import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import ScreenHeader from '@/src/components/ScreenHeader';
import AskFab from '@/src/components/AskFab';
import { weekAheadPlan, type PlannedMeal } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const SLOT_META: Record<PlannedMeal['slot'], { label: string; icon: string }> = {
  B: { label: 'Breakfast', icon: 'sunny-outline' },
  L: { label: 'Lunch', icon: 'restaurant-outline' },
  S: { label: 'Snack', icon: 'cafe-outline' },
  D: { label: 'Dinner', icon: 'moon-outline' },
};

export default function WeekPlanScreen() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>(
    weekAheadPlan.days.find((d) => d.isToday)?.key ?? weekAheadPlan.days[0].key
  );
  const [doneWorkouts, setDoneWorkouts] = useState<Record<string, boolean>>({});

  const selected = useMemo(
    () => weekAheadPlan.days.find((d) => d.key === selectedKey) ?? weekAheadPlan.days[0],
    [selectedKey]
  );
  const totalKcal = selected.meals.reduce((s, m) => s + m.kcal, 0);

  const pickDay = (key: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedKey(key);
  };

  const toggleWorkout = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDoneWorkouts((d) => ({ ...d, [key]: !d[key] }));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Week ahead" subtitle={weekAheadPlan.range} showBack rightIcon="share-outline" />

      {/* Focus banner */}
      <View style={styles.focusRow}>
        <Ionicons name="leaf" size={12} color={colors.brand} />
        <Text style={styles.focusText}>{weekAheadPlan.focus}</Text>
        <View style={styles.focusDivider} />
        <Text style={styles.focusStat}>{weekAheadPlan.totals.workouts} workouts</Text>
      </View>

      {/* Day picker rail */}
      <FlatList
        data={weekAheadPlan.days}
        keyExtractor={(d) => d.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => {
          const active = item.key === selectedKey;
          return (
            <Pressable
              testID={`day-${item.key}`}
              onPress={() => pickDay(item.key)}
              style={[styles.dayCell, active && styles.dayCellActive]}
            >
              <Text style={[styles.dayCellShort, active && styles.dayCellShortActive]}>
                {item.short.toUpperCase()}
              </Text>
              <Text style={[styles.dayCellDate, active && styles.dayCellDateActive]}>{item.date}</Text>
              <View style={styles.dayCellDot}>
                {item.isToday && !active && <View style={styles.todayIndicator} />}
                {item.isRest && !item.isToday && <View style={styles.restIndicator} />}
              </View>
            </Pressable>
          );
        }}
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Day header */}
        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayName}>
              {selected.label}
              {selected.isToday && <Text style={styles.todayInline}>  · Today</Text>}
            </Text>
            <Text style={styles.dayMeta}>
              {totalKcal} kcal · {selected.workout ? selected.workout.duration + ' workout' : 'Rest day'}
            </Text>
          </View>
        </View>

        {/* Workout card */}
        {selected.workout ? (
          <View style={[styles.workoutCard, shadows.card, doneWorkouts[selected.key] && styles.workoutDone]}>
            <View style={styles.workoutLeft}>
              <View style={[styles.workoutIcon, doneWorkouts[selected.key] && styles.workoutIconDone]}>
                <Ionicons
                  name={selected.workout.icon as any}
                  size={22}
                  color={doneWorkouts[selected.key] ? colors.onBrandPrimary : colors.brand}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutEyebrow}>WORKOUT</Text>
                <Text style={[
                  styles.workoutTitle,
                  doneWorkouts[selected.key] && styles.strike,
                ]}>
                  {selected.workout.title}
                </Text>
                <Text style={styles.workoutMeta}>
                  {selected.workout.duration} · {selected.workout.intensity} intensity
                </Text>
              </View>
            </View>
            <Pressable
              testID={`workout-check-${selected.key}`}
              onPress={() => toggleWorkout(selected.key)}
              style={[styles.checkBtn, doneWorkouts[selected.key] && styles.checkBtnDone]}
              hitSlop={10}
            >
              {doneWorkouts[selected.key] ? (
                <Ionicons name="checkmark" size={18} color={colors.onBrandPrimary} />
              ) : (
                <Text style={styles.checkBtnText}>Mark done</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={[styles.restCard, shadows.card]}>
            <View style={styles.restIconBox}>
              <Ionicons name="bed-outline" size={20} color="#8A4A20" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.restTitle}>Rest & recover</Text>
              <Text style={styles.restMeta}>Hydrate, stretch, sleep well</Text>
            </View>
          </View>
        )}

        {/* Meals */}
        <Text style={styles.sectionTitle}>Meals</Text>
        <View style={styles.mealsList}>
          {selected.meals.map((meal, i) => (
            <View
              key={meal.slot}
              style={[styles.mealRow, i < selected.meals.length - 1 && styles.mealRowBorder]}
            >
              <View style={styles.mealSlotIcon}>
                <Ionicons name={SLOT_META[meal.slot].icon as any} size={16} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealSlotLabel}>{SLOT_META[meal.slot].label}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.mealKcal}>{meal.kcal}<Text style={styles.mealUnit}> kcal</Text></Text>
                <Text style={styles.mealTag}>{meal.tag}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          testID={`open-recos-${selected.key}`}
          onPress={() => router.push('/recommendations')}
          style={styles.detailBtn}
        >
          <Ionicons name="restaurant-outline" size={14} color={colors.brand} />
          <Text style={styles.detailBtnText}>Full meal details & recipes</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>

      <AskFab bottom={40} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  focusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  focusText: { fontSize: 12, color: colors.brand, fontWeight: font.bold, letterSpacing: 0.2 },
  focusDivider: { width: 3, height: 3, borderRadius: 999, backgroundColor: colors.onSurfaceSecondary, marginHorizontal: 6, opacity: 0.6 },
  focusStat: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.semibold },

  rail: {
    paddingHorizontal: spacing.lg, gap: 8,
    paddingBottom: spacing.md,
  },
  dayCell: {
    width: 46, paddingVertical: 10, paddingHorizontal: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', gap: 2,
  },
  dayCellActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  dayCellShort: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.bold, letterSpacing: 0.6 },
  dayCellShortActive: { color: 'rgba(255,255,255,0.85)' },
  dayCellDate: { fontSize: 17, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  dayCellDateActive: { color: colors.onBrandPrimary },
  dayCellDot: { height: 6, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  todayIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand },
  restIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D18E62' },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },

  dayHeader: { marginBottom: 4 },
  dayName: {
    fontSize: 24, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.5,
  },
  todayInline: { fontSize: 14, color: colors.brand, fontWeight: font.semibold, letterSpacing: 0 },
  dayMeta: { fontSize: 13, color: colors.onSurfaceSecondary, marginTop: 4, fontWeight: font.medium },

  workoutCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  workoutDone: { backgroundColor: colors.brandTertiary, borderColor: colors.brandSecondary + '55' },
  workoutLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  workoutIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  workoutIconDone: { backgroundColor: colors.brand },
  workoutEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.2 },
  workoutTitle: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, marginTop: 2 },
  workoutMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  strike: { textDecorationLine: 'line-through', color: colors.onSurfaceSecondary },

  checkBtn: {
    paddingHorizontal: 14, height: 36,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  checkBtnDone: {
    backgroundColor: colors.brand, width: 36, paddingHorizontal: 0,
  },
  checkBtnText: { fontSize: 12, color: colors.brand, fontWeight: font.bold },

  restCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: '#FBE7D6',
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  restIconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(138,74,32,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  restTitle: { fontSize: type.base, fontWeight: font.bold, color: '#8A4A20' },
  restMeta: { fontSize: 12, color: '#8A4A20', opacity: 0.85, marginTop: 2 },

  sectionTitle: {
    fontSize: 13, fontWeight: font.bold, color: colors.onSurfaceSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase', marginTop: spacing.sm,
  },

  mealsList: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  mealRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  mealRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  mealSlotIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  mealSlotLabel: { fontSize: 11, fontWeight: font.bold, color: colors.brand, letterSpacing: 0.8 },
  mealName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface, marginTop: 2 },
  mealKcal: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  mealUnit: { fontSize: 11, fontWeight: font.medium, color: colors.onSurfaceSecondary },
  mealTag: {
    fontSize: 10, color: colors.brand, fontWeight: font.bold,
    marginTop: 4, letterSpacing: 0.3,
  },

  detailBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, marginTop: 4,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.brandSecondary + '55',
    backgroundColor: colors.surfaceSecondary,
  },
  detailBtnText: { fontSize: 13, fontWeight: font.bold, color: colors.brand },
});
