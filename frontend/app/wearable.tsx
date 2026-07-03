import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '@/src/components/ScreenHeader';
import Sparkline from '@/src/components/Sparkline';
import { todayMetrics, wearable } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const OTHER_DEVICES = [
  { id: 'apple', name: 'Apple Watch', icon: 'watch-outline' },
  { id: 'garmin', name: 'Garmin', icon: 'watch-outline' },
  { id: 'oura', name: 'Oura Ring', icon: 'ellipse-outline' },
  { id: 'wear', name: 'Wear OS', icon: 'watch-outline' },
];

export default function WearableScreen() {
  const [sync, setSync] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Wearable" subtitle="Connect and sync your device" showBack rightIcon="settings-outline" />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Device card */}
        <View style={[styles.deviceCard, shadows.card]}>
          <View style={styles.deviceHead}>
            <View style={styles.deviceIcon}>
              <Ionicons name="watch" size={26} color={colors.onBrandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>{wearable.deviceName}</Text>
              <View style={styles.statusRow}>
                <View style={styles.liveDot} />
                <Text style={styles.statusText}>Connected · Synced {wearable.lastSync}</Text>
              </View>
            </View>
          </View>

          <View style={styles.batteryBar}>
            <View style={styles.batteryLabel}>
              <Ionicons name="battery-half-outline" size={16} color={colors.brand} />
              <Text style={styles.batteryText}>Battery</Text>
            </View>
            <View style={styles.batteryTrack}>
              <View style={[styles.batteryFill, { width: `${wearable.battery}%` }]} />
            </View>
            <Text style={styles.batteryPct}>{wearable.battery}%</Text>
          </View>

          <View style={styles.deviceActions}>
            <Pressable testID="sync-now-btn" style={styles.actionBtn}>
              <Ionicons name="sync-outline" size={16} color={colors.brand} />
              <Text style={styles.actionText}>Sync now</Text>
            </Pressable>
            <Pressable testID="disconnect-btn" style={[styles.actionBtn, { borderColor: colors.error }]}>
              <Ionicons name="unlink-outline" size={16} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Disconnect</Text>
            </Pressable>
          </View>
        </View>

        {/* Live metrics */}
        <Text style={styles.sectionTitle}>Live metrics</Text>
        <View style={styles.metricsGrid}>
          {todayMetrics.map((m) => (
            <View key={m.id} style={[styles.metricTile, shadows.card]}>
              <View style={styles.metricHead}>
                <View style={styles.metricIcon}>
                  <Ionicons name={m.icon as any} size={16} color={colors.brand} />
                </View>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricUnit}>{m.unit}</Text>
              <Sparkline data={m.trend} width={140} height={28} />
            </View>
          ))}
        </View>

        {/* Sync options */}
        <Text style={styles.sectionTitle}>Sync options</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.rowItem}>
            <View style={styles.rowIcon}>
              <Ionicons name="sync-outline" size={18} color={colors.brand} />
            </View>
            <Text style={styles.rowTitle}>Background sync</Text>
            <Switch value={sync} onValueChange={setSync} thumbColor="#FFF" trackColor={{ false: colors.borderStrong, true: colors.brand }} testID="toggle-sync" />
          </View>
          <View style={[styles.rowItem, { borderTopWidth: 1, borderTopColor: colors.divider }]}>
            <View style={styles.rowIcon}>
              <Ionicons name="cloud-outline" size={18} color={colors.brand} />
            </View>
            <Text style={styles.rowTitle}>Auto-sync when unlocked</Text>
            <Switch value={autoSync} onValueChange={setAutoSync} thumbColor="#FFF" trackColor={{ false: colors.borderStrong, true: colors.brand }} testID="toggle-autosync" />
          </View>
        </View>

        {/* Other devices */}
        <Text style={styles.sectionTitle}>Add another device</Text>
        <View style={styles.deviceList}>
          {OTHER_DEVICES.map((d) => (
            <Pressable key={d.id} testID={`add-device-${d.id}`} style={styles.deviceOption}>
              <Ionicons name={d.icon as any} size={20} color={colors.onSurface} />
              <Text style={styles.deviceOptionName}>{d.name}</Text>
              <Ionicons name="add-circle-outline" size={20} color={colors.brand} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  deviceCard: {
    padding: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  deviceHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deviceIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  deviceName: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  statusText: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.medium },

  batteryBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  batteryLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  batteryText: { fontSize: 12, color: colors.onSurface, fontWeight: font.semibold },
  batteryTrack: { flex: 1, height: 6, backgroundColor: colors.surfaceTertiary, borderRadius: 3, overflow: 'hidden' },
  batteryFill: { height: '100%', backgroundColor: colors.brand, borderRadius: 3 },
  batteryPct: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface, minWidth: 34, textAlign: 'right' },

  deviceActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.brand,
    backgroundColor: colors.brandTertiary,
  },
  actionText: { fontSize: type.base, fontWeight: font.semibold, color: colors.brand },

  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginTop: spacing.xl, marginBottom: spacing.md },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  metricTile: {
    width: '48%', padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  metricHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  metricLabel: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  metricValue: { fontSize: 24, fontWeight: font.bold, color: colors.onSurface, marginTop: 8, letterSpacing: -0.5 },
  metricUnit: { fontSize: 11, color: colors.onSurfaceSecondary, marginBottom: 6 },

  group: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface, flex: 1 },

  deviceList: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  deviceOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  deviceOptionName: { flex: 1, fontSize: type.base, fontWeight: font.medium, color: colors.onSurface },
});
