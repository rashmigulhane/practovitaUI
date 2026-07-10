import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '@/src/components/ScreenHeader';
import { wearableSettings as seed } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const FREQS: { key: 'auto' | 'hourly' | 'manual'; label: string; sub: string }[] = [
  { key: 'auto', label: 'Automatic', sub: 'Every 5 min · recommended' },
  { key: 'hourly', label: 'Hourly', sub: 'Saves battery' },
  { key: 'manual', label: 'Manual only', sub: 'Sync when you tap' },
];

export default function WearableSettingsScreen() {
  const [metrics, setMetrics] = useState(seed.metrics);
  const [frequency, setFrequency] = useState<'auto' | 'hourly' | 'manual'>('auto');
  const [dnd, setDnd] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalText, setGoalText] = useState('');

  const toggleMetric = (id: string, field: 'enabled' | 'notify') => {
    Haptics.selectionAsync().catch(() => {});
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m)));
  };

  const startEditGoal = (id: string, current: number) => {
    setEditingGoal(id);
    setGoalText(String(current));
  };

  const commitGoal = () => {
    if (!editingGoal) return;
    const val = parseFloat(goalText) || 0;
    setMetrics((prev) => prev.map((m) => (m.id === editingGoal ? { ...m, goal: val } : m)));
    setEditingGoal(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Wearable settings" subtitle="Per-metric goals & sync" showBack />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Sync frequency */}
        <Text style={styles.sectionTitle}>Sync frequency</Text>
        <View style={[styles.group, shadows.card]}>
          {FREQS.map((f, i) => {
            const active = f.key === frequency;
            return (
              <Pressable
                key={f.key}
                testID={`freq-${f.key}`}
                onPress={() => {
                  setFrequency(f.key);
                  Haptics.selectionAsync().catch(() => {});
                }}
                style={[styles.freqRow, i < FREQS.length - 1 && styles.rowBorder]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.freqLabel}>{f.label}</Text>
                  <Text style={styles.freqSub}>{f.sub}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Do not disturb */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.rowItem}>
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={18} color={colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Do not disturb</Text>
              <Text style={styles.rowSub}>Silence sync alerts overnight</Text>
            </View>
            <Switch value={dnd} onValueChange={setDnd} thumbColor="#FFF" trackColor={{ false: colors.borderStrong, true: colors.brand }} testID="toggle-dnd" />
          </View>
        </View>

        {/* Per-metric config */}
        <Text style={styles.sectionTitle}>Metrics to track</Text>
        <View style={[styles.group, shadows.card]}>
          {metrics.map((m, i) => (
            <View key={m.id} style={[styles.metricBlock, i < metrics.length - 1 && styles.rowBorder]}>
              <View style={styles.metricRow}>
                <View style={[styles.rowIcon, !m.enabled && { opacity: 0.4 }]}>
                  <Ionicons name={m.icon as any} size={18} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, !m.enabled && { color: colors.onSurfaceSecondary }]}>{m.label}</Text>
                  <Text style={styles.rowSub}>
                    Goal: {m.goal === 0 ? 'Auto-tracked' : `${m.goal.toLocaleString()} ${m.unit}`}
                  </Text>
                </View>
                <Switch
                  value={m.enabled}
                  onValueChange={() => toggleMetric(m.id, 'enabled')}
                  thumbColor="#FFF"
                  trackColor={{ false: colors.borderStrong, true: colors.brand }}
                  testID={`toggle-${m.id}`}
                />
              </View>

              {m.enabled && m.goal > 0 && (
                <View style={styles.subActions}>
                  {editingGoal === m.id ? (
                    <View style={styles.editRow}>
                      <TextInput
                        testID={`goal-input-${m.id}`}
                        value={goalText}
                        onChangeText={(v) => setGoalText(v.replace(/[^0-9.]/g, ''))}
                        keyboardType="number-pad"
                        style={styles.goalInput}
                        autoFocus
                      />
                      <Text style={styles.goalUnit}>{m.unit}</Text>
                      <Pressable testID={`save-goal-${m.id}`} onPress={commitGoal} style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Save</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      testID={`edit-goal-${m.id}`}
                      onPress={() => startEditGoal(m.id, m.goal)}
                      style={styles.subBtn}
                    >
                      <Ionicons name="create-outline" size={13} color={colors.brand} />
                      <Text style={styles.subBtnText}>Change goal</Text>
                    </Pressable>
                  )}
                  <Pressable
                    testID={`notify-${m.id}`}
                    onPress={() => toggleMetric(m.id, 'notify')}
                    style={[styles.subBtn, m.notify && styles.subBtnActive]}
                  >
                    <Ionicons
                      name={m.notify ? 'notifications' : 'notifications-off-outline'}
                      size={13}
                      color={m.notify ? colors.onBrandPrimary : colors.onSurfaceSecondary}
                    />
                    <Text style={[styles.subBtnText, m.notify && { color: colors.onBrandPrimary }]}>
                      {m.notify ? 'Alerts on' : 'Alerts off'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.dangerBox}>
          <Pressable testID="reset-defaults" style={styles.dangerBtn}>
            <Ionicons name="refresh-outline" size={14} color={colors.error} />
            <Text style={styles.dangerBtnText}>Reset to defaults</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  sectionTitle: {
    fontSize: 13, fontWeight: font.bold, color: colors.onSurfaceSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase', marginTop: spacing.md,
  },
  group: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  freqRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  freqLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  freqSub: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 3 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },

  rowItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  rowSub: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 3 },

  metricBlock: { padding: spacing.md },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  subActions: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, marginLeft: 48,
  },
  subBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceTertiary,
  },
  subBtnActive: { backgroundColor: colors.brand },
  subBtnText: { fontSize: 11, fontWeight: font.bold, color: colors.brand },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  goalInput: {
    borderWidth: 1, borderColor: colors.brand, borderRadius: radius.sm,
    paddingHorizontal: 10, paddingVertical: 6, fontSize: 14,
    fontWeight: font.bold, color: colors.onSurface, minWidth: 80,
  },
  goalUnit: { fontSize: 12, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  saveBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  saveBtnText: { color: colors.onBrandPrimary, fontSize: 12, fontWeight: font.bold },

  dangerBox: { alignItems: 'center', marginTop: spacing.lg },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, borderWidth: 1, borderColor: colors.error,
  },
  dangerBtnText: { color: colors.error, fontSize: 12, fontWeight: font.bold },
});
