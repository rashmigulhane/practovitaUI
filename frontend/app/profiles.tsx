import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '@/src/components/ScreenHeader';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import PrimaryButton from '@/src/components/PrimaryButton';
import { profiles as seed } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState(seed);
  const [activeId, setActiveId] = useState(seed[0].id);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenHeader title="Family profiles" subtitle="Manage health journeys for your loved ones" showBack />

      <ScrollView contentContainerStyle={styles.body}>
        {profiles.map((p) => {
          const active = p.id === activeId;
          return (
            <Pressable
              key={p.id}
              testID={`family-item-${p.id}`}
              onPress={() => setActiveId(p.id)}
              style={[styles.card, shadows.card, active && styles.cardActive]}
            >
              <ProfileAvatar initials={p.initials} color={p.color} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.meta}>{p.relation} · {p.age} yrs · {p.gender}</Text>
              </View>
              {active && (
                <View style={styles.activePill}>
                  <Ionicons name="checkmark" size={14} color={colors.onBrandPrimary} />
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              )}
              {!active && (
                <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceSecondary} />
              )}
            </Pressable>
          );
        })}

        <Pressable
          testID="add-family-member"
          onPress={() => {
            const initials = String.fromCharCode(65 + profiles.length) + 'X';
            setProfiles([...profiles, {
              id: String(profiles.length + 1),
              name: 'New member',
              relation: 'Family',
              age: 30,
              gender: 'other',
              initials,
              color: '#7C786E',
            }]);
          }}
          style={styles.addCard}
        >
          <View style={styles.addIcon}>
            <Ionicons name="person-add-outline" size={22} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addTitle}>Add family member</Text>
            <Text style={styles.addMeta}>Start their health journey</Text>
          </View>
          <Ionicons name="add-circle" size={26} color={colors.brand} />
        </Pressable>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.brand} />
          <Text style={styles.infoText}>
            Each family member has their own private questionnaire, lab reports, and AI conversation. You can switch profiles anytime from Home.
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          testID="continue-with-active"
          label={`Continue as ${profiles.find(p => p.id === activeId)?.name.split(' ')[0]}`}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  cardActive: { borderColor: colors.brand, backgroundColor: colors.brandTertiary },
  name: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  meta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  activePillText: { fontSize: 11, fontWeight: font.bold, color: colors.onBrandPrimary },

  addCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 2, borderColor: colors.borderStrong, borderStyle: 'dashed',
  },
  addIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  addTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  addMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },

  infoBox: {
    flexDirection: 'row', gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    marginTop: spacing.md,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.onBrandTertiary, lineHeight: 18 },

  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.divider },
});
