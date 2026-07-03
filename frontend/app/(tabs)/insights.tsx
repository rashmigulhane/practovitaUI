import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Sparkline from '@/src/components/Sparkline';
import StatusPill from '@/src/components/StatusPill';
import PrimaryButton from '@/src/components/PrimaryButton';
import { labMetrics, reports } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const CATEGORIES = ['All', 'CBC', 'Diabetes', 'Lipids', 'Thyroid', 'Kidney', 'Vitamins'];
const STATUS_LABEL: Record<string, string> = { success: 'Normal', warning: 'Watch', error: 'High' };

export default function InsightsScreen() {
  const router = useRouter();
  const [cat, setCat] = useState('All');
  const filtered = useMemo(
    () => (cat === 'All' ? labMetrics : labMetrics.filter((m) => m.category === cat)),
    [cat]
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Sticky header + chip row */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Insights</Text>
            <Text style={styles.sub}>Lab metrics & health trends</Text>
          </View>
          <Pressable
            testID="insights-upload-fab"
            onPress={() => router.push('/upload')}
            style={styles.fab}
          >
            <Ionicons name="add" size={22} color={colors.onBrandPrimary} />
          </Pressable>
        </View>

        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => {
            const active = item === cat;
            return (
              <Pressable
                testID={`chip-${item}`}
                onPress={() => setCat(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent reports */}
        <Text style={styles.sectionTitle}>Recent reports</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reportsRow}
        >
          {reports.map((r) => (
            <Pressable
              key={r.id}
              testID={`report-${r.id}`}
              onPress={() => router.push(`/report/${r.id}`)}
              style={[styles.reportCard, shadows.card]}
            >
              <View style={styles.reportIcon}>
                <Ionicons name="document-text-outline" size={20} color={colors.brand} />
              </View>
              <Text style={styles.reportTitle} numberOfLines={2}>{r.label}</Text>
              <Text style={styles.reportMeta}>{r.date}</Text>
              <Text style={styles.reportMeta}>{r.metrics} metrics · {r.lab}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Metrics */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>All metrics</Text>
        <View style={styles.list}>
          {filtered.map((m) => (
            <View key={m.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricName}>{m.name}</Text>
                <Text style={styles.metricRange}>Reference: {m.range} {m.unit}</Text>
              </View>
              <View style={styles.spark}>
                <Sparkline
                  data={m.trend}
                  width={70}
                  height={30}
                  color={m.status === 'success' ? colors.success : m.status === 'warning' ? colors.warning : colors.error}
                />
              </View>
              <View style={styles.valueCol}>
                <Text style={styles.metricValue}>
                  {m.value}
                  <Text style={styles.metricUnit}> {m.unit}</Text>
                </Text>
                <StatusPill status={m.status} label={STATUS_LABEL[m.status]} />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyCta}>
        <PrimaryButton
          testID="insights-upload-cta"
          label="Upload new report"
          onPress={() => router.push('/upload')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  stickyHeader: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: { fontSize: 28, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.6 },
  sub: { fontSize: type.base, color: colors.onSurfaceSecondary, marginTop: 2 },
  fab: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.cardStrong,
  },
  chipsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    height: 56,
    alignItems: 'center',
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  chipTextActive: { color: colors.onBrandPrimary },
  body: { padding: spacing.lg, paddingTop: spacing.lg },
  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginBottom: spacing.md },
  reportsRow: { gap: spacing.md, paddingRight: spacing.lg },
  reportCard: {
    width: 190, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  reportIcon: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  reportTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface, lineHeight: 20 },
  reportMeta: { fontSize: 11, color: colors.onSurfaceSecondary },
  list: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  metricName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  metricRange: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },
  spark: { width: 70 },
  valueCol: { alignItems: 'flex-end', gap: 4, minWidth: 78 },
  metricValue: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  metricUnit: { fontSize: 10, fontWeight: font.medium, color: colors.onSurfaceSecondary },
  stickyCta: {
    position: 'absolute', left: 0, right: 0, bottom: 82,
    padding: spacing.md,
    backgroundColor: 'transparent',
  },
});
