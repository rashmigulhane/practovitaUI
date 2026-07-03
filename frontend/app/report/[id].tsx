import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Sparkline from '@/src/components/Sparkline';
import StatusPill from '@/src/components/StatusPill';
import PrimaryButton from '@/src/components/PrimaryButton';
import { labMetrics, reports } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const STATUS_LABEL: Record<string, string> = { success: 'Normal', warning: 'Watch', error: 'High' };

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const report = reports.find((r) => r.id === id) ?? reports[0];
  const attention = labMetrics.filter((m) => m.status !== 'success');
  const normal = labMetrics.filter((m) => m.status === 'success');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable testID="back-btn" onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.iconBtn} hitSlop={12} testID="share-btn">
          <Ionicons name="share-outline" size={20} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.reportTitle}>{report.label}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="calendar-outline" size={12} color={colors.onSurfaceSecondary} />
            <Text style={styles.metaText}>{report.date}</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="business-outline" size={12} color={colors.onSurfaceSecondary} />
            <Text style={styles.metaText}>{report.lab}</Text>
          </View>
        </View>

        {/* Summary card */}
        <View style={[styles.summary, shadows.card]}>
          <SummaryStat count={normal.length} label="Normal" color={colors.success} />
          <View style={styles.divider} />
          <SummaryStat count={attention.filter(m => m.status === 'warning').length} label="Watch" color={colors.warning} />
          <View style={styles.divider} />
          <SummaryStat count={attention.filter(m => m.status === 'error').length} label="High" color={colors.error} />
        </View>

        {/* Needs attention */}
        {attention.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <View style={styles.warnDot} />
              <Text style={styles.sectionTitle}>Needs attention</Text>
            </View>
            <View style={styles.list}>
              {attention.map((m, i) => (
                <View key={m.id} style={[styles.row, i < attention.length - 1 && styles.rowBorder]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.metricName}>{m.name}</Text>
                    <Text style={styles.metricRange}>Reference: {m.range} {m.unit}</Text>
                  </View>
                  <View style={{ width: 60 }}>
                    <Sparkline data={m.trend} width={60} height={28} color={m.status === 'warning' ? colors.warning : colors.error} />
                  </View>
                  <View style={styles.valueCol}>
                    <Text style={styles.metricValue}>{m.value}</Text>
                    <Text style={styles.metricUnit}>{m.unit}</Text>
                    <StatusPill status={m.status} label={STATUS_LABEL[m.status]} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Normal metrics */}
        <View style={styles.sectionHead}>
          <View style={[styles.warnDot, { backgroundColor: colors.brand }]} />
          <Text style={styles.sectionTitle}>Normal range</Text>
        </View>
        <View style={styles.list}>
          {normal.map((m, i) => (
            <View key={m.id} style={[styles.row, i < normal.length - 1 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.metricName}>{m.name}</Text>
                <Text style={styles.metricRange}>Reference: {m.range} {m.unit}</Text>
              </View>
              <View style={styles.valueCol}>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricUnit}>{m.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.stickyCta}>
        <PrimaryButton
          testID="report-ask-cta"
          label="Ask AI about this report"
          onPress={() => router.push('/(tabs)/ask')}
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryStat({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceTertiary,
  },
  body: { padding: spacing.lg, paddingTop: 0 },
  reportTitle: { fontSize: 28, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.6 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: colors.surfaceTertiary,
  },
  metaText: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.medium },

  summary: {
    flexDirection: 'row', marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statCount: { fontSize: 30, fontWeight: font.bold, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 4, fontWeight: font.semibold, letterSpacing: 0.4 },
  divider: { width: 1, backgroundColor: colors.divider },

  sectionHead: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  warnDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },

  list: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  metricName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  metricRange: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },
  valueCol: { alignItems: 'flex-end', minWidth: 70, gap: 3 },
  metricValue: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  metricUnit: { fontSize: 10, color: colors.onSurfaceSecondary },

  stickyCta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
});
