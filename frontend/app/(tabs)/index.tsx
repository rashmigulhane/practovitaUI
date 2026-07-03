import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Sparkline from '@/src/components/Sparkline';
import RiskGauge from '@/src/components/RiskGauge';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import { profiles, todayMetrics, riskScores, wearable } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const me = profiles[0];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        testID="home-scroll"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{me.name.split(' ')[0]}</Text>
          </View>
          <Pressable
            testID="home-profile-switcher"
            onPress={() => router.push('/profiles')}
            style={styles.avatarBtn}
          >
            <ProfileAvatar initials={me.initials} color={me.color} size={44} />
          </Pressable>
        </View>

        {/* Wearable status pill */}
        <Pressable
          testID="home-wearable-status"
          onPress={() => router.push('/wearable')}
          style={styles.wearableCard}
        >
          <View style={styles.wearableIcon}>
            <Ionicons name="watch-outline" size={20} color={colors.onBrandTertiary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.wearableTitle}>{wearable.deviceName}</Text>
            <Text style={styles.wearableSub}>Synced {wearable.lastSync} · Battery {wearable.battery}%</Text>
          </View>
          <View style={styles.liveDot} />
        </Pressable>

        {/* Metrics grid */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>
        <View style={styles.grid}>
          {todayMetrics.map((m) => (
            <View key={m.id} style={[styles.metricCard, shadows.card]}>
              <View style={styles.metricHead}>
                <View style={styles.metricIcon}>
                  <Ionicons name={m.icon as any} size={16} color={colors.brand} />
                </View>
                {m.delta && (
                  <View style={styles.deltaPill}>
                    <Ionicons name="trending-up" size={10} color={colors.onBrandTertiary} />
                    <Text style={styles.deltaText}>{m.delta}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricUnit}>{m.unit}</Text>
              <View style={styles.spark}>
                <Sparkline data={m.trend} width={140} height={30} />
              </View>
            </View>
          ))}
        </View>

        {/* Risk scores */}
        <View style={[styles.sectionHead, { marginTop: spacing.xl }]}>
          <Text style={styles.sectionTitle}>Health risk</Text>
          <Pressable onPress={() => router.push('/onboarding/results')}>
            <Text style={styles.sectionAction}>Details</Text>
          </Pressable>
        </View>

        <View style={[styles.riskCard, shadows.card]}>
          <View style={styles.riskRow}>
            <View style={styles.riskItem}>
              <RiskGauge
                score={riskScores.diabetes.score}
                level={riskScores.diabetes.level}
                label="diabetes"
                size={140}
              />
            </View>
            <View style={styles.riskDivider} />
            <View style={styles.riskItem}>
              <RiskGauge
                score={riskScores.cvd.score}
                level={riskScores.cvd.level}
                label="CVD"
                size={140}
              />
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={[styles.sectionHead, { marginTop: spacing.xl }]}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.actionsRow}>
          <ActionCard
            icon="cloud-upload-outline"
            label="Upload report"
            onPress={() => router.push('/upload')}
            testID="action-upload"
          />
          <ActionCard
            icon="restaurant-outline"
            label="Diet plan"
            onPress={() => router.push('/recommendations')}
            testID="action-diet"
          />
          <ActionCard
            icon="barbell-outline"
            label="Workouts"
            onPress={() => router.push('/recommendations')}
            testID="action-workout"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, label, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={styles.actionCard}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color={colors.brand} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: type.base, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  name: { fontSize: 28, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.6, marginTop: 2 },
  avatarBtn: {},

  wearableCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
    borderWidth: 1, borderColor: colors.brandSecondary + '40',
  },
  wearableIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  wearableTitle: { fontSize: type.base, fontWeight: font.semibold, color: colors.onBrandTertiary },
  wearableSub: { fontSize: 12, color: colors.onBrandTertiary, opacity: 0.75, marginTop: 2 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },

  sectionHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  sectionAction: { fontSize: type.base, color: colors.brand, fontWeight: font.semibold },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  metricCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  metricHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  deltaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  deltaText: { fontSize: 10, fontWeight: font.bold, color: colors.onBrandTertiary },
  metricLabel: { fontSize: type.sm, color: colors.onSurfaceSecondary, marginTop: spacing.md, fontWeight: font.medium },
  metricValue: { fontSize: 26, fontWeight: font.bold, color: colors.onSurface, marginTop: 2, letterSpacing: -0.5 },
  metricUnit: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 0 },
  spark: { marginTop: spacing.sm, marginLeft: -spacing.xs },

  riskCard: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
  riskRow: { flexDirection: 'row', alignItems: 'center' },
  riskItem: { flex: 1, alignItems: 'center' },
  riskDivider: { width: 1, height: 100, backgroundColor: colors.divider },

  actionsRow: { flexDirection: 'row', gap: spacing.md },
  actionCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'flex-start', gap: spacing.sm,
    minHeight: 90, justifyContent: 'space-between',
  },
  actionIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurface },
});
