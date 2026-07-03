import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ProfileAvatar from '@/src/components/ProfileAvatar';
import { profiles, wearable } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeId, setActiveId] = useState(profiles[0].id);
  const [notifs, setNotifs] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile switcher */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Family profiles</Text>
          <Pressable testID="profile-manage-link" onPress={() => router.push('/profiles')}>
            <Text style={styles.link}>Manage</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarsRow}
        >
          {profiles.map((p) => {
            const active = p.id === activeId;
            return (
              <Pressable
                key={p.id}
                testID={`profile-avatar-${p.id}`}
                onPress={() => setActiveId(p.id)}
                style={styles.profChip}
              >
                <ProfileAvatar initials={p.initials} color={p.color} size={64} active={active} />
                <Text style={[styles.profName, active && { color: colors.brand, fontWeight: font.bold }]}>
                  {p.name.split(' ')[0]}
                </Text>
                <Text style={styles.profRel}>{p.relation}</Text>
              </Pressable>
            );
          })}
          <Pressable
            testID="add-profile-button"
            onPress={() => router.push('/profiles')}
            style={styles.addProf}
          >
            <View style={styles.addCircle}>
              <Ionicons name="add" size={24} color={colors.brand} />
            </View>
            <Text style={styles.addLabel}>Add</Text>
          </Pressable>
        </ScrollView>

        {/* Connected devices */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Connected devices</Text>
        <Pressable
          testID="wearable-detail-link"
          onPress={() => router.push('/wearable')}
          style={[styles.card, shadows.card]}
        >
          <View style={styles.deviceRow}>
            <View style={styles.deviceIcon}>
              <Ionicons name="watch-outline" size={22} color={colors.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>{wearable.deviceName}</Text>
              <Text style={styles.deviceMeta}>Connected · {wearable.battery}% battery</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceSecondary} />
          </View>
        </Pressable>

        {/* Settings groups */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Health</Text>
        <View style={[styles.group, shadows.card]}>
          <Row
            icon="clipboard-outline"
            title="Health questionnaire"
            subtitle="Retake or update your answers"
            onPress={() => router.push('/onboarding/questionnaire')}
            testID="row-questionnaire"
          />
          <Row
            icon="pulse-outline"
            title="Risk assessment"
            subtitle="View diabetes & CVD scores"
            onPress={() => router.push('/onboarding/results')}
            testID="row-risk"
          />
          <Row
            icon="restaurant-outline"
            title="Diet & workout plan"
            subtitle="Personalised recommendations"
            onPress={() => router.push('/recommendations')}
            testID="row-plan"
            last
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Preferences</Text>
        <View style={[styles.group, shadows.card]}>
          <ToggleRow
            icon="notifications-outline"
            title="Push notifications"
            value={notifs}
            onChange={setNotifs}
            testID="toggle-notif"
          />
          <ToggleRow
            icon="sunny-outline"
            title="Daily health tips"
            value={dailyTips}
            onChange={setDailyTips}
            testID="toggle-tips"
            last
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Account</Text>
        <View style={[styles.group, shadows.card]}>
          <Row icon="lock-closed-outline" title="Privacy & data" onPress={() => {}} testID="row-privacy" />
          <Row icon="help-circle-outline" title="Help & support" onPress={() => {}} testID="row-help" />
          <Row icon="log-out-outline" title="Sign out" onPress={() => router.replace('/')} testID="row-signout" last danger />
        </View>

        <Text style={styles.version}>Practavita · v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, title, subtitle, onPress, testID, last, danger }: any) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.rowItem,
        !last && styles.rowBorder,
        pressed && { backgroundColor: colors.surfaceTertiary },
      ]}
    >
      <View style={[styles.rowIcon, danger && { backgroundColor: '#F6DAD5' }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.brand} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, danger && { color: colors.error }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceSecondary} />}
    </Pressable>
  );
}

function ToggleRow({ icon, title, value, onChange, testID, last }: any) {
  return (
    <View style={[styles.rowItem, !last && styles.rowBorder]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.brand} />
      </View>
      <Text style={[styles.rowTitle, { flex: 1 }]}>{title}</Text>
      <Switch
        testID={testID}
        value={value}
        onValueChange={onChange}
        thumbColor="#FFF"
        trackColor={{ false: colors.borderStrong, true: colors.brand }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.6 },

  sectionHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3, marginBottom: spacing.md, marginTop: spacing.xl },
  link: { color: colors.brand, fontWeight: font.semibold, fontSize: type.base },

  avatarsRow: { gap: spacing.md, paddingRight: spacing.lg },
  profChip: { alignItems: 'center', width: 76, gap: 4 },
  profName: { fontSize: 13, color: colors.onSurface, fontWeight: font.semibold, marginTop: 6 },
  profRel: { fontSize: 11, color: colors.onSurfaceSecondary },
  addProf: { alignItems: 'center', width: 76, gap: 4 },
  addCircle: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, borderColor: colors.borderStrong, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  addLabel: { fontSize: 13, color: colors.onSurfaceSecondary, fontWeight: font.medium, marginTop: 6 },

  card: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border,
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deviceIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  deviceName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  deviceMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },

  group: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  rowSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },

  version: { textAlign: 'center', color: colors.onSurfaceSecondary, fontSize: 12, marginTop: spacing.xl },
});
