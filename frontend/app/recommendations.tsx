import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '@/src/components/ScreenHeader';
import { dietPlan, workouts } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

export default function RecommendationsScreen() {
  const [tab, setTab] = useState<'diet' | 'workout'>('diet');
  const totalKcal = dietPlan.reduce((s, m) => s + m.kcal, 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Your plan" subtitle="Personalised for your health profile" showBack />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton label="Diet" active={tab === 'diet'} onPress={() => setTab('diet')} testID="tab-diet" icon="restaurant-outline" />
        <TabButton label="Workout" active={tab === 'workout'} onPress={() => setTab('workout')} testID="tab-workout" icon="barbell-outline" />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {tab === 'diet' ? (
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

            {dietPlan.map((meal) => (
              <View key={meal.id} style={[styles.mealCard, shadows.card]}>
                <View style={styles.mealHead}>
                  <View>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
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
            ))}
          </>
        ) : (
          <>
            <View style={[styles.summaryCard, shadows.card]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>This week</Text>
                <Text style={styles.summaryValue}>3 / 5 <Text style={styles.summaryUnit}>sessions</Text></Text>
                <Text style={styles.summarySub}>150 min moderate activity</Text>
              </View>
              <View style={styles.progressRing}>
                <Text style={styles.ringPct}>60%</Text>
              </View>
            </View>

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
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress, testID, icon }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Ionicons name={icon} size={16} color={active ? colors.onBrandPrimary : colors.onSurface} />
      <Text style={[styles.tabLabel, active && { color: colors.onBrandPrimary }]}>{label}</Text>
    </Pressable>
  );
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroPill}>
      <Text style={styles.macroLbl}>{label}</Text>
      <Text style={styles.macroVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  tabsRow: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  tabLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },

  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  summaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
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
  progressRing: {
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 6, borderColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  ringPct: { fontSize: 14, fontWeight: font.bold, color: colors.brand },

  mealCard: {
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  mealHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  mealMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  smallBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  mealItems: { marginTop: spacing.md, gap: 8 },
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
