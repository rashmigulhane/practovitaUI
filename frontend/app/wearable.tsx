import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '@/src/components/ScreenHeader';
import Sparkline from '@/src/components/Sparkline';
import PrimaryButton from '@/src/components/PrimaryButton';
import { todayMetrics, wearable as initialWearable, availableDevices } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const SYNC_STEPS = [
  { key: 'steps', label: 'Activity & steps', icon: 'walk-outline' },
  { key: 'hr', label: 'Heart rate', icon: 'heart-outline' },
  { key: 'sleep', label: 'Sleep stages', icon: 'moon-outline' },
  { key: 'kcal', label: 'Calorie burn', icon: 'flame-outline' },
];

export default function WearableScreen() {
  const router = useRouter();
  const [sync, setSync] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [connected, setConnected] = useState(initialWearable.connected);
  const [syncingIdx, setSyncingIdx] = useState<number>(-1); // -1 idle, 0-3 progress, 4 done
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const startSync = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSyncingIdx(0);
    const tick = (i: number) => {
      if (i > SYNC_STEPS.length) {
        setTimeout(() => setSyncingIdx(-1), 1400);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        return;
      }
      setSyncingIdx(i);
      setTimeout(() => tick(i + 1), 700);
    };
    setTimeout(() => tick(1), 700);
  };

  const doDisconnect = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setConnected(false);
    setDisconnectOpen(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader
        title="Wearable"
        subtitle={connected ? 'Connected & syncing' : 'Not connected'}
        showBack
        rightIcon="settings-outline"
        onRightPress={() => router.push('/wearable-settings')}
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {connected ? (
          <View style={[styles.deviceCard, shadows.card]}>
            <View style={styles.deviceHead}>
              <View style={styles.deviceIcon}>
                <Ionicons name="watch" size={26} color={colors.onBrandPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{initialWearable.deviceName}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.liveDot} />
                  <Text style={styles.statusText}>Synced {initialWearable.lastSync}</Text>
                </View>
              </View>
            </View>

            <View style={styles.batteryBar}>
              <View style={styles.batteryLabel}>
                <Ionicons name="battery-half-outline" size={16} color={colors.brand} />
                <Text style={styles.batteryText}>Battery</Text>
              </View>
              <View style={styles.batteryTrack}>
                <View style={[styles.batteryFill, { width: `${initialWearable.battery}%` }]} />
              </View>
              <Text style={styles.batteryPct}>{initialWearable.battery}%</Text>
            </View>

            <View style={styles.deviceActions}>
              <Pressable testID="sync-now-btn" onPress={startSync} style={styles.actionBtn}>
                <Ionicons name="sync-outline" size={16} color={colors.brand} />
                <Text style={styles.actionText}>Sync now</Text>
              </Pressable>
              <Pressable testID="disconnect-btn" onPress={() => setDisconnectOpen(true)} style={[styles.actionBtn, { borderColor: colors.error }]}>
                <Ionicons name="unlink-outline" size={16} color={colors.error} />
                <Text style={[styles.actionText, { color: colors.error }]}>Disconnect</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.disconnectedCard, shadows.card]}>
            <Ionicons name="watch-outline" size={36} color={colors.onSurfaceSecondary} />
            <Text style={styles.disconnectedTitle}>No device connected</Text>
            <Text style={styles.disconnectedSub}>Reconnect Fitbit or add a new device below.</Text>
            <PrimaryButton
              testID="reconnect-btn"
              label="Reconnect Fitbit"
              onPress={() => setConnected(true)}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {/* Live metrics */}
        {connected && (
          <>
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
          </>
        )}

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
          <Pressable
            testID="open-wearable-settings"
            onPress={() => router.push('/wearable-settings')}
            style={[styles.rowItem, { borderTopWidth: 1, borderTopColor: colors.divider }]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="options-outline" size={18} color={colors.brand} />
            </View>
            <Text style={[styles.rowTitle, { flex: 1 }]}>Advanced settings</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceSecondary} />
          </Pressable>
        </View>

        {/* Other devices */}
        <View style={styles.sectionHeadRow}>
          <Text style={styles.sectionTitle}>Connect another device</Text>
          <Pressable testID="scan-devices" onPress={() => router.push('/wearable-pair')}>
            <Text style={styles.link}>Scan</Text>
          </Pressable>
        </View>
        <View style={styles.deviceList}>
          {availableDevices.filter((d) => !d.connected).slice(0, 5).map((d) => (
            <Pressable
              key={d.id}
              testID={`add-device-${d.id}`}
              onPress={() => router.push({ pathname: '/wearable-pair', params: { device: d.id } })}
              style={styles.deviceOption}
            >
              <View style={styles.deviceOptionIcon}>
                <Ionicons name={d.icon as any} size={18} color={colors.onSurface} />
              </View>
              <Text style={styles.deviceOptionName}>{d.name}</Text>
              <Ionicons name="add-circle-outline" size={20} color={colors.brand} />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Sync modal */}
      <Modal visible={syncingIdx >= 0} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.syncCard, shadows.cardStrong]}>
            <View style={styles.syncIconWrap}>
              {syncingIdx > SYNC_STEPS.length ? (
                <Ionicons name="checkmark-circle" size={44} color={colors.brand} />
              ) : (
                <Ionicons name="sync" size={32} color={colors.brand} />
              )}
            </View>
            <Text style={styles.syncTitle}>
              {syncingIdx > SYNC_STEPS.length ? 'Sync complete!' : 'Syncing your data'}
            </Text>
            <Text style={styles.syncSub}>{initialWearable.deviceName}</Text>
            <View style={styles.syncSteps}>
              {SYNC_STEPS.map((s, i) => {
                const done = syncingIdx > i;
                const active = syncingIdx === i + 1;
                return (
                  <View key={s.key} style={styles.syncRow}>
                    <View style={[styles.syncDot, done && styles.syncDotDone, active && styles.syncDotActive]}>
                      {done && <Ionicons name="checkmark" size={11} color={colors.onBrandPrimary} />}
                    </View>
                    <Ionicons name={s.icon as any} size={14} color={done ? colors.brand : colors.onSurfaceSecondary} />
                    <Text style={[styles.syncStepLabel, done && { color: colors.onSurface, fontWeight: font.semibold }]}>
                      {s.label}
                    </Text>
                    {active && <Text style={styles.syncPct}>syncing…</Text>}
                    {done && <Text style={[styles.syncPct, { color: colors.brand }]}>✓</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Disconnect confirmation modal */}
      <Modal visible={disconnectOpen} transparent animationType="fade" onRequestClose={() => setDisconnectOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setDisconnectOpen(false)}>
          <Pressable style={[styles.confirmCard, shadows.cardStrong]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.syncIconWrap, { backgroundColor: '#F6DAD5' }]}>
              <Ionicons name="unlink-outline" size={28} color={colors.error} />
            </View>
            <Text style={styles.syncTitle}>Disconnect {initialWearable.deviceName}?</Text>
            <Text style={[styles.syncSub, { marginTop: 6, textAlign: 'center', paddingHorizontal: spacing.md }]}>
              Your existing data will remain, but new metrics won{'\u2019'}t be synced until you reconnect.
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, width: '100%' }}>
              <Pressable testID="cancel-disconnect" onPress={() => setDisconnectOpen(false)} style={[styles.confirmBtn, { backgroundColor: colors.surfaceTertiary }]}>
                <Text style={[styles.confirmBtnText, { color: colors.onSurface }]}>Cancel</Text>
              </Pressable>
              <Pressable testID="confirm-disconnect" onPress={doDisconnect} style={[styles.confirmBtn, { backgroundColor: colors.error }]}>
                <Text style={[styles.confirmBtnText, { color: '#FFF' }]}>Disconnect</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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

  disconnectedCard: {
    padding: spacing.xl, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', gap: spacing.sm,
  },
  disconnectedTitle: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface, marginTop: spacing.sm },
  disconnectedSub: { fontSize: 13, color: colors.onSurfaceSecondary, textAlign: 'center' },

  sectionHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl },
  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginTop: spacing.xl, marginBottom: spacing.md },
  link: { color: colors.brand, fontWeight: font.bold, fontSize: type.base, marginTop: spacing.xl, marginBottom: spacing.md },
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
  deviceOptionIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  deviceOptionName: { flex: 1, fontSize: type.base, fontWeight: font.medium, color: colors.onSurface },

  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
    padding: spacing.lg,
  },
  syncCard: {
    width: '100%', maxWidth: 340,
    padding: spacing.xl, borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  confirmCard: {
    width: '100%', maxWidth: 340,
    padding: spacing.xl, borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  syncIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  syncTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  syncSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 4, fontWeight: font.medium },
  syncSteps: { marginTop: spacing.lg, gap: 10, width: '100%' },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  syncDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  syncDotDone: { backgroundColor: colors.brand, borderColor: colors.brand },
  syncDotActive: { borderColor: colors.brand, backgroundColor: colors.brandTertiary },
  syncStepLabel: { flex: 1, fontSize: 13, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  syncPct: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.semibold },

  confirmBtn: {
    flex: 1, paddingVertical: 12, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnText: { fontSize: type.base, fontWeight: font.bold },
});
