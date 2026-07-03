import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import Sparkline from '@/src/components/Sparkline';
import RiskGauge from '@/src/components/RiskGauge';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import AskFab from '@/src/components/AskFab';
import { profiles, todayMetrics, riskScores, wearable, wellnessScore, dietPlan, workouts } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

function WellnessRing({ score, size = 100 }: { score: number; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#FFFFFF" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: font.bold, color: '#FFF', letterSpacing: -0.8 }}>{score}</Text>
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: font.semibold, letterSpacing: 1 }}>SCORE</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const me = profiles[0];
  const nextMeal = dietPlan[1];
  const nextWorkout = workouts[0];

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
          <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
            <Pressable testID="home-notif" style={styles.iconBtn} hitSlop={12}>
              <Ionicons name="notifications-outline" size={20} color={colors.onSurface} />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable
              testID="home-profile-switcher"
              onPress={() => router.push('/profiles')}
            >
              <ProfileAvatar initials={me.initials} color={me.color} size={44} />
            </Pressable>
          </View>
        </View>

        {/* Wellness Score Hero */}
        <LinearGradient
          colors={['#5A7D66', '#3E5C4A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, shadows.cardStrong]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.heroEyebrow}>WELLNESS SCORE</Text>
            <View style={styles.heroRow}>
              <Text style={styles.heroDelta}>
                <Ionicons name="trending-up" size={14} color="#B9D7C4" /> {wellnessScore.delta} pts this week
              </Text>
            </View>
            <View style={styles.streakChip}>
              <Ionicons name="flame" size={12} color="#FFB889" />
              <Text style={styles.streakText}>{wellnessScore.streak}-day streak</Text>
            </View>

            {/* Week strip */}
            <View style={styles.weekStrip}>
              {wellnessScore.weekdays.map((d, i) => (
                <View key={i} style={styles.weekDay}>
                  <View style={[
                    styles.weekDot,
                    d.done && { backgroundColor: '#FFF', borderColor: '#FFF' },
                    d.today && !d.done && { borderColor: '#FFF', borderWidth: 2 },
                  ]}>
                    {d.done && <Ionicons name="checkmark" size={10} color={colors.brand} />}
                  </View>
                  <Text style={[styles.weekLabel, d.today && { color: '#FFF', fontWeight: font.bold }]}>{d.day}</Text>
                </View>
              ))}
            </View>
          </View>
          <WellnessRing score={wellnessScore.current} />
        </LinearGradient>

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
          <Pressable onPress={() => router.push('/wearable')}>
            <Text style={styles.sectionAction}>See all</Text>
          </Pressable>
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

        {/* Today's plan preview */}
        <View style={[styles.sectionHead, { marginTop: spacing.xl }]}>
          <Text style={styles.sectionTitle}>Today{'\u2019'}s plan</Text>
          <Pressable onPress={() => router.push('/(tabs)/plan')}>
            <Text style={styles.sectionAction}>Open plan</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Pressable
            testID="home-next-meal"
            onPress={() => router.push('/(tabs)/plan')}
            style={[styles.planCard, shadows.card]}
          >
            <View style={[styles.planIcon, { backgroundColor: '#F5E3D3' }]}>
              <Ionicons name="restaurant" size={18} color="#8A4A20" />
            </View>
            <Text style={styles.planEyebrow}>NEXT MEAL</Text>
            <Text style={styles.planTitle}>{nextMeal.title}</Text>
            <Text style={styles.planSub}>{nextMeal.kcal} kcal · {nextMeal.tag}</Text>
          </Pressable>
          <Pressable
            testID="home-next-workout"
            onPress={() => router.push('/(tabs)/plan')}
            style={[styles.planCard, shadows.card]}
          >
            <View style={[styles.planIcon, { backgroundColor: colors.brandTertiary }]}>
              <Ionicons name="barbell" size={18} color={colors.brand} />
            </View>
            <Text style={styles.planEyebrow}>NEXT WORKOUT</Text>
            <Text style={styles.planTitle}>{nextWorkout.title}</Text>
            <Text style={styles.planSub}>{nextWorkout.duration} · {nextWorkout.intensity}</Text>
          </Pressable>
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
          <ActionCard icon="cloud-upload-outline" label="Upload report" onPress={() => router.push('/upload')} testID="action-upload" />
          <ActionCard icon="water-outline" label="Log meal" onPress={() => router.push('/(tabs)/plan')} testID="action-diet" />
          <ActionCard icon="watch-outline" label="Devices" onPress={() => router.push('/wearable')} testID="action-devices" />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <AskFab bottom={100} />
    </SafeAreaView>
  );
}

function ActionCard({ icon, label, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.actionCard, shadows.card]}>
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
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceTertiary,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 12,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error,
    borderWidth: 1.5, borderColor: colors.surface,
  },

  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
  },
  heroEyebrow: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: font.bold, letterSpacing: 1.6 },
  heroRow: { marginTop: 6 },
  heroDelta: { color: '#B9D7C4', fontSize: 12, fontWeight: font.semibold },
  streakChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)',
    alignSelf: 'flex-start', marginTop: 10,
  },
  streakText: { color: '#FFF', fontSize: 11, fontWeight: font.bold },
  weekStrip: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  weekDay: { alignItems: 'center', gap: 4 },
  weekDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  weekLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: font.semibold },

  wearableCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, marginTop: spacing.md,
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
    width: '48%', padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
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
  metricUnit: { fontSize: 11, color: colors.onSurfaceSecondary },
  spark: { marginTop: spacing.sm, marginLeft: -spacing.xs },

  planCard: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  planIcon: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  planEyebrow: { fontSize: 9, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.2 },
  planTitle: { fontSize: type.base, fontWeight: font.bold, color: colors.onSurface },
  planSub: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: -2 },

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
