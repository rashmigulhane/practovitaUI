import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { notifications as seed, type Notif } from '../data/mock';
import { colors, font, radius, shadows, spacing, type } from '../theme/tokens';

type Props = { visible: boolean; onClose: () => void };

const CATS: { key: 'all' | Notif['category']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'coach', label: 'Coach' },
  { key: 'lab', label: 'Labs' },
  { key: 'workout', label: 'Activity' },
  { key: 'meal', label: 'Meals' },
  { key: 'streak', label: 'Streaks' },
];

const TINT: Record<Notif['category'], { bg: string; fg: string }> = {
  coach: { bg: '#E3EBE6', fg: '#3E5C4A' },
  lab: { bg: '#F6DAD5', fg: '#7A2E29' },
  streak: { bg: '#FBE7D6', fg: '#8A4A20' },
  workout: { bg: '#E3EBE6', fg: '#3E5C4A' },
  meal: { bg: '#F2F2F0', fg: '#40403C' },
  meds: { bg: '#F6DAD5', fg: '#7A2E29' },
};

export default function NotificationsSheet({ visible, onClose }: Props) {
  const [items, setItems] = useState<Notif[]>(seed);
  const [cat, setCat] = useState<'all' | Notif['category']>('all');

  const filtered = useMemo(
    () => (cat === 'all' ? items : items.filter((n) => n.category === cat)),
    [items, cat]
  );
  const unread = items.filter((i) => i.unread).length;

  const markAll = () => setItems(items.map((n) => ({ ...n, unread: false })));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} testID="notif-backdrop" />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.sub}>
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {unread > 0 && (
              <Pressable testID="notif-mark-all" onPress={markAll} style={styles.markBtn}>
                <Text style={styles.markBtnText}>Mark all read</Text>
              </Pressable>
            )}
            <Pressable testID="notif-close" onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Ionicons name="close" size={20} color={colors.onSurface} />
            </Pressable>
          </View>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATS.map((c) => {
            const active = c.key === cat;
            const count = c.key === 'all' ? items.length : items.filter((i) => i.category === c.key).length;
            return (
              <Pressable
                key={c.key}
                testID={`notif-chip-${c.key}`}
                onPress={() => setCat(c.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.label} <Text style={[styles.chipCount, active && { color: colors.onBrandPrimary }]}>{count}</Text>
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((n) => {
            const tint = TINT[n.category];
            return (
              <Pressable
                key={n.id}
                testID={`notif-${n.id}`}
                onPress={() => setItems(items.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
                style={[styles.item, n.unread && styles.itemUnread]}
              >
                <View style={[styles.itemIcon, { backgroundColor: tint.bg }]}>
                  <Ionicons name={n.icon as any} size={18} color={tint.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.itemHead}>
                    <Text style={styles.itemTitle}>{n.title}</Text>
                    {n.unread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.itemBody} numberOfLines={2}>{n.body}</Text>
                  <Text style={styles.itemTime}>{n.time}</Text>
                </View>
              </Pressable>
            );
          })}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={28} color={colors.onSurfaceSecondary} />
              <Text style={styles.emptyText}>No {cat} notifications</Text>
            </View>
          )}
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    ...shadows.cardStrong,
  },
  grabber: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center', marginTop: 10, marginBottom: 6,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  title: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.4 },
  sub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2, fontWeight: font.medium },
  markBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  markBtnText: { color: colors.brand, fontSize: 12, fontWeight: font.bold },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  chipsRow: {
    paddingHorizontal: spacing.lg, gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  chip: {
    height: 34, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  chipActive: { backgroundColor: colors.brand },
  chipText: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  chipTextActive: { color: colors.onBrandPrimary },
  chipCount: { fontWeight: font.bold, color: colors.brand },

  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.lg },
  item: {
    flexDirection: 'row', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  itemUnread: { borderColor: colors.brandSecondary + '55', backgroundColor: '#F7FBF8' },
  itemIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemTitle: { flex: 1, fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  itemBody: { fontSize: 12, color: colors.onSurfaceSecondary, lineHeight: 17, marginTop: 3 },
  itemTime: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 6, fontWeight: font.medium },

  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyText: { fontSize: 13, color: colors.onSurfaceSecondary, fontWeight: font.medium },
});
