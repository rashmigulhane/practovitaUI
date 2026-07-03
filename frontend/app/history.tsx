import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '@/src/components/ScreenHeader';
import { historyFeed } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const FILTERS = ['All', 'Workouts', 'Meals', 'Reports', 'Coach', 'Habits'] as const;
type Filter = (typeof FILTERS)[number];

const iconTint: Record<string, { bg: string; fg: string }> = {
  workout: { bg: '#E3EBE6', fg: '#3E5C4A' },
  meal: { bg: '#FBE7D6', fg: '#8A4A20' },
  report: { bg: '#F2F2F0', fg: '#40403C' },
  coach: { bg: '#F6DAD5', fg: '#7A2E29' },
  habit: { bg: '#E3EBE6', fg: '#3E5C4A' },
};

export default function HistoryScreen() {
  const [filter, setFilter] = useState<Filter>('All');

  const items = useMemo(() => {
    if (filter === 'All') return historyFeed;
    const map: Record<Filter, string> = {
      All: '', Workouts: 'workout', Meals: 'meal', Reports: 'report', Coach: 'coach', Habits: 'habit',
    };
    return historyFeed.filter((h) => h.type === map[filter]);
  }, [filter]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof items> = {};
    items.forEach((it) => {
      if (!g[it.day]) g[it.day] = [];
      g[it.day].push(it);
    });
    return g;
  }, [items]);

  const total = historyFeed.length;
  const workouts = historyFeed.filter(h => h.type === 'workout').length;
  const meals = historyFeed.filter(h => h.type === 'meal').length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="History" subtitle="Everything you've accomplished" showBack />

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{total}</Text>
          <Text style={styles.summaryLabel}>Activities</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{workouts}</Text>
          <Text style={styles.summaryLabel}>Workouts</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{meals}</Text>
          <Text style={styles.summaryLabel}>Meals</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: '#D18E62' }]}>12</Text>
          <Text style={styles.summaryLabel}>Day streak</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              testID={`filter-${f}`}
              onPress={() => setFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([day, arr]) => (
          <View key={day} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <View style={styles.dayDot} />
              <Text style={styles.dayLabel}>{day}</Text>
              <View style={styles.dayLine} />
              <Text style={styles.dayCount}>{arr.length}</Text>
            </View>

            {arr.map((entry, i) => {
              const tint = iconTint[entry.type];
              return (
                <View key={entry.id} style={styles.entryRow}>
                  <View style={styles.timelineCol}>
                    <View style={[styles.entryIcon, { backgroundColor: tint.bg }]}>
                      <Ionicons name={entry.icon as any} size={16} color={tint.fg} />
                    </View>
                    {i < arr.length - 1 && <View style={styles.entryLine} />}
                  </View>
                  <View style={[styles.entryCard, shadows.card]}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    <Text style={styles.entryMeta}>{entry.meta}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {Object.keys(grouped).length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={28} color={colors.onSurfaceSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No activities yet</Text>
            <Text style={styles.emptySub}>Try a different filter or log an activity today</Text>
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  summaryStrip: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  summaryBox: {
    flex: 1, alignItems: 'center',
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  summaryValue: { fontSize: 22, fontWeight: font.bold, color: colors.brand, letterSpacing: -0.4 },
  summaryLabel: { fontSize: 10, fontWeight: font.semibold, color: colors.onSurfaceSecondary, marginTop: 4, letterSpacing: 0.4 },

  chipsRow: {
    paddingHorizontal: spacing.lg, gap: spacing.sm,
    paddingBottom: spacing.md, height: 56, alignItems: 'center',
  },
  chip: {
    height: 36, paddingHorizontal: 16, borderRadius: 999,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  chipTextActive: { color: colors.onBrandPrimary },

  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  daySection: { marginBottom: spacing.lg },
  dayHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: spacing.md,
  },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand },
  dayLabel: { fontSize: 13, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  dayLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dayCount: { fontSize: 11, fontWeight: font.bold, color: colors.onSurfaceSecondary },

  entryRow: { flexDirection: 'row', gap: spacing.md },
  timelineCol: { alignItems: 'center', width: 32 },
  entryIcon: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  entryLine: { width: 2, flex: 1, backgroundColor: colors.divider, marginVertical: 4, minHeight: 20 },
  entryCard: {
    flex: 1, padding: spacing.md, marginBottom: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  entryTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  entryMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 3 },

  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: 6 },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  emptySub: { fontSize: 13, color: colors.onSurfaceSecondary },
});
