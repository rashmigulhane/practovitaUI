import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '@/src/components/ScreenHeader';
import PrimaryButton from '@/src/components/PrimaryButton';
import { myCoach, coachSessions } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

const SLOTS = [
  { day: 'Tomorrow', date: 'Nov 20', slots: ['10:00 AM', '2:00 PM', '5:30 PM'] },
  { day: 'Thu', date: 'Nov 21', slots: ['9:30 AM', '11:00 AM', '4:00 PM'] },
  { day: 'Fri', date: 'Nov 22', slots: ['10:00 AM', '3:00 PM'] },
];

export default function CoachScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'history'>('overview');

  const upcoming = coachSessions.find((s) => s.upcoming);
  const past = coachSessions.filter((s) => !s.upcoming);

  const book = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSelectedSlot(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Your Coach" subtitle="Guidance from certified experts" showBack />

      <View style={styles.tabSwitcher}>
        <Pressable testID="coach-tab-overview" onPress={() => setTab('overview')} style={[styles.tabPill, tab === 'overview' && styles.tabPillActive]}>
          <Text style={[styles.tabPillLabel, tab === 'overview' && { color: colors.onBrandPrimary }]}>Overview</Text>
        </Pressable>
        <Pressable testID="coach-tab-history" onPress={() => setTab('history')} style={[styles.tabPill, tab === 'history' && styles.tabPillActive]}>
          <Text style={[styles.tabPillLabel, tab === 'history' && { color: colors.onBrandPrimary }]}>History ({past.length})</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {tab === 'overview' && (
          <>
            {/* Coach card */}
            <LinearGradient
              colors={['#5A7D66', '#3E5C4A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.coachCard, shadows.cardStrong]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{myCoach.initials}</Text>
              </View>
              <Text style={styles.coachName}>{myCoach.name}</Text>
              <Text style={styles.coachTitle}>{myCoach.title}</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={12} color="#FFD98A" />
                ))}
                <Text style={styles.ratingText}>4.9 · 128 clients</Text>
              </View>
              <View style={styles.coachActions}>
                <Pressable testID="coach-message" style={styles.coachAction}>
                  <Ionicons name="chatbubble-outline" size={16} color="#FFF" />
                  <Text style={styles.coachActionText}>Message</Text>
                </Pressable>
                <Pressable testID="coach-call" style={styles.coachAction}>
                  <Ionicons name="call-outline" size={16} color="#FFF" />
                  <Text style={styles.coachActionText}>Call</Text>
                </Pressable>
              </View>
            </LinearGradient>

            {/* Upcoming session */}
            {upcoming && (
              <>
                <Text style={styles.sectionTitle}>Upcoming session</Text>
                <View style={[styles.upcomingCard, shadows.card]}>
                  <View style={styles.upcomingHead}>
                    <View style={styles.dateCol}>
                      <Text style={styles.dateNum}>20</Text>
                      <Text style={styles.dateMonth}>NOV</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.upcomingTopic}>{upcoming.topic}</Text>
                      <View style={styles.upcomingMeta}>
                        <View style={styles.metaBadge}>
                          <Ionicons name={upcoming.type === 'video' ? 'videocam-outline' : upcoming.type === 'call' ? 'call-outline' : 'chatbubble-outline'} size={11} color={colors.brand} />
                          <Text style={styles.metaBadgeText}>{upcoming.type}</Text>
                        </View>
                        <View style={styles.metaBadge}>
                          <Ionicons name="time-outline" size={11} color={colors.onSurfaceSecondary} />
                          <Text style={[styles.metaBadgeText, { color: colors.onSurfaceSecondary }]}>{upcoming.duration}</Text>
                        </View>
                      </View>
                      <Text style={styles.upcomingWhen}>{upcoming.when}</Text>
                    </View>
                  </View>
                  <View style={styles.upcomingActions}>
                    <Pressable testID="reschedule" style={styles.smallGhost}>
                      <Text style={styles.smallGhostText}>Reschedule</Text>
                    </Pressable>
                    <Pressable testID="join-session" style={styles.smallPrimary}>
                      <Ionicons name="videocam" size={14} color={colors.onBrandPrimary} />
                      <Text style={styles.smallPrimaryText}>Join</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}

            {/* Book a slot */}
            <Text style={styles.sectionTitle}>Book a new session</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.lg }}>
              {SLOTS.map((d, i) => (
                <Pressable
                  key={i}
                  testID={`day-${i}`}
                  onPress={() => setSelectedDay(i)}
                  style={[styles.dayCard, i === selectedDay && styles.dayCardActive]}
                >
                  <Text style={[styles.dayCardLbl, i === selectedDay && { color: colors.onBrandPrimary }]}>{d.day}</Text>
                  <Text style={[styles.dayCardDate, i === selectedDay && { color: colors.onBrandPrimary }]}>{d.date}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.slotsWrap}>
              {SLOTS[selectedDay].slots.map((s) => (
                <Pressable
                  key={s}
                  testID={`slot-${s}`}
                  onPress={() => setSelectedSlot(s)}
                  style={[styles.slotBtn, selectedSlot === s && styles.slotBtnActive]}
                >
                  <Text style={[styles.slotText, selectedSlot === s && { color: colors.onBrandPrimary }]}>{s}</Text>
                </Pressable>
              ))}
            </View>

            {selectedSlot && (
              <PrimaryButton
                testID="book-session"
                label={`Book ${SLOTS[selectedDay].day} at ${selectedSlot}`}
                onPress={book}
                style={{ marginTop: spacing.md }}
              />
            )}

            <View style={{ height: spacing.xxl }} />
          </>
        )}

        {tab === 'history' && (
          <>
            <Text style={styles.sectionTitle}>Past sessions</Text>
            {past.map((s) => (
              <Pressable key={s.id} testID={`session-${s.id}`} style={[styles.sessionCard, shadows.card]}>
                <View style={styles.sessionHead}>
                  <View style={styles.sessionIcon}>
                    <Ionicons
                      name={s.type === 'video' ? 'videocam' : s.type === 'call' ? 'call' : 'chatbubbles'}
                      size={16}
                      color={colors.brand}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionTopic}>{s.topic}</Text>
                    <Text style={styles.sessionMeta}>{s.when} · {s.duration}</Text>
                  </View>
                </View>
                {s.notes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesLabel}>NOTES</Text>
                    <Text style={styles.notesText}>{s.notes}</Text>
                  </View>
                )}
              </Pressable>
            ))}
            <View style={{ height: spacing.xxl }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  tabSwitcher: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  tabPill: {
    flex: 1, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.surfaceTertiary, alignItems: 'center',
  },
  tabPillActive: { backgroundColor: colors.brand },
  tabPillLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurfaceSecondary },

  body: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },

  coachCard: {
    padding: spacing.xl, borderRadius: radius.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: font.bold, letterSpacing: 0.5 },
  coachName: { color: '#FFF', fontSize: type.xxl, fontWeight: font.bold, marginTop: spacing.md, letterSpacing: -0.4 },
  coachTitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, textAlign: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  ratingText: { color: '#FFF', fontSize: 12, fontWeight: font.semibold, marginLeft: 4 },
  coachActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  coachAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  coachActionText: { color: '#FFF', fontSize: 13, fontWeight: font.semibold },

  sectionTitle: {
    fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface,
    letterSpacing: -0.3, marginTop: spacing.md, marginBottom: spacing.sm,
  },

  upcomingCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
    borderWidth: 1, borderColor: colors.brandSecondary + '40',
  },
  upcomingHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dateCol: {
    width: 52, height: 60, borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  dateNum: { fontSize: 22, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.4 },
  dateMonth: { fontSize: 9, fontWeight: font.bold, color: colors.brand, letterSpacing: 1 },
  upcomingTopic: { fontSize: type.base, fontWeight: font.bold, color: colors.onBrandTertiary },
  upcomingMeta: { flexDirection: 'row', gap: 6, marginTop: 4 },
  metaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, backgroundColor: colors.surfaceSecondary,
  },
  metaBadgeText: { fontSize: 10, fontWeight: font.semibold, color: colors.brand, textTransform: 'capitalize' },
  upcomingWhen: { fontSize: 12, color: colors.onBrandTertiary, marginTop: 6, fontWeight: font.medium },
  upcomingActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  smallGhost: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.brand,
  },
  smallGhostText: { color: colors.brand, fontSize: 13, fontWeight: font.semibold },
  smallPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.brand,
  },
  smallPrimaryText: { color: colors.onBrandPrimary, fontSize: 13, fontWeight: font.bold },

  dayCard: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', minWidth: 84,
  },
  dayCardActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  dayCardLbl: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  dayCardDate: { fontSize: 14, fontWeight: font.bold, color: colors.onSurface, marginTop: 2 },

  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  slotBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  slotBtnActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  slotText: { fontSize: 13, fontWeight: font.semibold, color: colors.onSurface },

  sessionCard: {
    padding: spacing.md, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md,
  },
  sessionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sessionIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionTopic: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  sessionMeta: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  notesBox: {
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceTertiary, gap: 4,
  },
  notesLabel: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.2 },
  notesText: { fontSize: 13, color: colors.onSurface, lineHeight: 19 },
});
