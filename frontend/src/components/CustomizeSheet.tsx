import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, font, radius, shadows, spacing, type } from '../theme/tokens';

type Props = { visible: boolean; onClose: () => void };

const ACTIONS = [
  { icon: 'swap-horizontal-outline', label: 'Swap a meal', sub: 'Pick from alternate options', action: 'swap-meal' },
  { icon: 'barbell-outline', label: 'Change a workout', sub: 'Pick from alternatives', action: 'swap-workout' },
  { icon: 'speedometer-outline', label: 'Adjust intensity', sub: 'Easier or harder', action: 'intensity' },
  { icon: 'refresh-outline', label: 'Regenerate this week', sub: 'Fresh AI-generated plan', action: 'regenerate' },
  { icon: 'options-outline', label: 'Edit preferences', sub: 'Diet, cuisines, equipment', action: 'prefs' },
];

export default function CustomizeSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const handle = (a: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onClose();
    if (a === 'prefs') setTimeout(() => router.push('/plan-preferences'), 250);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} testID="cust-backdrop" />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Customize plan</Text>
            <Text style={styles.sub}>Choose what to change</Text>
          </View>
          <Pressable testID="cust-close" onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={20} color={colors.onSurface} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {ACTIONS.map((a) => (
            <Pressable key={a.action} testID={`cust-${a.action}`} onPress={() => handle(a.action)} style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name={a.icon as any} size={20} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{a.label}</Text>
                <Text style={styles.itemSub}>{a.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceSecondary} />
            </Pressable>
          ))}
          <View style={{ height: spacing.lg }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '75%',
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
  title: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  itemIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  itemTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  itemSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
});
