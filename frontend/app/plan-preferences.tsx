import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '@/src/components/ScreenHeader';
import PrimaryButton from '@/src/components/PrimaryButton';
import { defaultPreferences, type PlanPreferences } from '@/src/data/mock';
import { colors, font, radius, spacing, type } from '@/src/theme/tokens';

const DIET_OPTIONS = [
  { key: 'veg', label: 'Vegetarian', icon: 'leaf-outline' },
  { key: 'nonveg', label: 'Non-vegetarian', icon: 'restaurant-outline' },
  { key: 'vegan', label: 'Vegan', icon: 'flower-outline' },
  { key: 'pescatarian', label: 'Pescatarian', icon: 'fish-outline' },
  { key: 'eggetarian', label: 'Eggetarian', icon: 'egg-outline' },
] as const;
const CUISINES = ['Indian', 'South Indian', 'North Indian', 'Continental', 'Mediterranean', 'Asian', 'Mexican', 'Middle Eastern'];
const WORKOUT_TYPES = ['Walking', 'Running', 'Yoga', 'Strength', 'HIIT', 'Cycling', 'Swimming', 'Pilates', 'Dance'];
const EQUIPMENT = [
  { key: 'none', label: 'No equipment', sub: 'Body-weight only' },
  { key: 'basic', label: 'Basic', sub: 'Dumbbells, bands, mat' },
  { key: 'full-gym', label: 'Full gym', sub: 'Complete access' },
] as const;
const DURATIONS = ['15', '30', '45', '60'] as const;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMINGS = [
  { key: 'morning', label: 'Morning', icon: 'sunny-outline' },
  { key: 'afternoon', label: 'Afternoon', icon: 'partly-sunny-outline' },
  { key: 'evening', label: 'Evening', icon: 'moon-outline' },
] as const;

export default function PlanPreferencesScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<PlanPreferences>(defaultPreferences);
  const [dislikeInput, setDislikeInput] = useState('');

  const toggle = (key: keyof PlanPreferences, value: string) => {
    Haptics.selectionAsync().catch(() => {});
    const arr = prefs[key] as string[];
    setPrefs({ ...prefs, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] });
  };

  const set = <K extends keyof PlanPreferences>(key: K, value: PlanPreferences[K]) => {
    Haptics.selectionAsync().catch(() => {});
    setPrefs({ ...prefs, [key]: value });
  };

  const addDislike = () => {
    const v = dislikeInput.trim();
    if (!v) return;
    setPrefs({ ...prefs, dislikes: [...prefs.dislikes, v] });
    setDislikeInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const generate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/(tabs)/plan?generated=1');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenHeader title="Personalise your plan" subtitle="A quick 60-second setup" showBack />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Diet type */}
        <Section num={1} title="Your diet" sub="Pick what applies to you">
          <View style={styles.chipsWrap}>
            {DIET_OPTIONS.map((d) => {
              const active = prefs.dietType === d.key;
              return (
                <Pressable key={d.key} testID={`diet-${d.key}`} onPress={() => set('dietType', d.key)} style={[styles.chipCard, active && styles.chipCardActive]}>
                  <Ionicons name={d.icon as any} size={16} color={active ? colors.onBrandPrimary : colors.brand} />
                  <Text style={[styles.chipCardText, active && { color: colors.onBrandPrimary }]}>{d.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Cuisines */}
        <Section num={2} title="Preferred cuisines" sub="Choose all that you enjoy">
          <View style={styles.chipsWrap}>
            {CUISINES.map((c) => {
              const active = prefs.cuisines.includes(c);
              return (
                <Pressable key={c} testID={`cuisine-${c}`} onPress={() => toggle('cuisines', c)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Dislikes */}
        <Section num={3} title="Foods to avoid" sub="Ingredients you dislike or allergens">
          <View style={styles.dislikeRow}>
            <TextInput
              testID="dislike-input"
              value={dislikeInput}
              onChangeText={setDislikeInput}
              placeholder="e.g. mushrooms, seafood…"
              placeholderTextColor={colors.onSurfaceSecondary}
              style={styles.dislikeInput}
              onSubmitEditing={addDislike}
              returnKeyType="done"
            />
            <Pressable testID="dislike-add" onPress={addDislike} style={styles.dislikeAdd}>
              <Ionicons name="add" size={20} color={colors.onBrandPrimary} />
            </Pressable>
          </View>
          {prefs.dislikes.length > 0 && (
            <View style={[styles.chipsWrap, { marginTop: spacing.sm }]}>
              {prefs.dislikes.map((d) => (
                <Pressable key={d} onPress={() => toggle('dislikes', d)} style={styles.dislikeChip}>
                  <Text style={styles.dislikeChipText}>{d}</Text>
                  <Ionicons name="close" size={12} color={colors.error} />
                </Pressable>
              ))}
            </View>
          )}
        </Section>

        {/* Workout types */}
        <Section num={4} title="Workouts you enjoy" sub="Pick 2–4 to get variety">
          <View style={styles.chipsWrap}>
            {WORKOUT_TYPES.map((w) => {
              const active = prefs.workoutTypes.includes(w);
              return (
                <Pressable key={w} testID={`wtype-${w}`} onPress={() => toggle('workoutTypes', w)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{w}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Equipment */}
        <Section num={5} title="Available equipment">
          <View style={{ gap: spacing.sm }}>
            {EQUIPMENT.map((e) => {
              const active = prefs.equipment === e.key;
              return (
                <Pressable key={e.key} testID={`eq-${e.key}`} onPress={() => set('equipment', e.key)} style={[styles.optRow, active && styles.optRowActive]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optLabel, active && { color: colors.onBrandTertiary }]}>{e.label}</Text>
                    <Text style={styles.optSub}>{e.sub}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Duration */}
        <Section num={6} title="Preferred workout length">
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => {
              const active = prefs.duration === d;
              return (
                <Pressable key={d} testID={`dur-${d}`} onPress={() => set('duration', d)} style={[styles.durationBtn, active && styles.durationBtnActive]}>
                  <Text style={[styles.durationVal, active && { color: colors.onBrandPrimary }]}>{d}</Text>
                  <Text style={[styles.durationLbl, active && { color: colors.onBrandPrimary }]}>min</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Days */}
        <Section num={7} title="Preferred workout days">
          <View style={styles.daysRow}>
            {DAYS.map((d) => {
              const active = prefs.workoutDays.includes(d);
              return (
                <Pressable key={d} testID={`day-${d}`} onPress={() => toggle('workoutDays', d)} style={[styles.dayBtn, active && styles.dayBtnActive]}>
                  <Text style={[styles.dayBtnText, active && { color: colors.onBrandPrimary }]}>{d}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Timing */}
        <Section num={8} title="Best time of day">
          <View style={styles.chipsWrap}>
            {TIMINGS.map((t) => {
              const active = prefs.timing === t.key;
              return (
                <Pressable key={t.key} testID={`time-${t.key}`} onPress={() => set('timing', t.key)} style={[styles.chipCard, active && styles.chipCardActive]}>
                  <Ionicons name={t.icon as any} size={16} color={active ? colors.onBrandPrimary : colors.brand} />
                  <Text style={[styles.chipCardText, active && { color: colors.onBrandPrimary }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <View style={{ height: spacing.md }} />
        <PrimaryButton testID="generate-plan" label="Generate my weekly plan" onPress={generate} />
        <Text style={styles.footNote}>
          You can update these anytime from Plan → Customize.
        </Text>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ num, title, sub, children }: any) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <View style={styles.secHead}>
        <View style={styles.secNum}><Text style={styles.secNumText}>{num}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.secTitle}>{title}</Text>
          {sub && <Text style={styles.secSub}>{sub}</Text>}
        </View>
      </View>
      <View style={styles.secBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingTop: 0 },

  secHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.sm },
  secNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  secNumText: { fontSize: 12, fontWeight: font.bold, color: colors.brand },
  secTitle: { fontSize: 15, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  secSub: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },
  secBody: { paddingLeft: 34 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurface },
  chipTextActive: { color: colors.onBrandPrimary },
  chipCard: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  chipCardActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipCardText: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface },

  dislikeRow: { flexDirection: 'row', gap: 8 },
  dislikeInput: {
    flex: 1, fontSize: 13, color: colors.onSurface,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  dislikeAdd: {
    width: 42, height: 42, borderRadius: radius.md,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  dislikeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
    backgroundColor: '#F6DAD5',
  },
  dislikeChipText: { fontSize: 12, color: colors.error, fontWeight: font.semibold },

  optRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  optRowActive: { backgroundColor: colors.brandTertiary, borderColor: colors.brand },
  optLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  optSub: { fontSize: 11, color: colors.onSurfaceSecondary, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },

  durationRow: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1, paddingVertical: 12, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', gap: 2,
  },
  durationBtnActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  durationVal: { fontSize: 18, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  durationLbl: { fontSize: 10, color: colors.onSurfaceSecondary, fontWeight: font.semibold },

  daysRow: { flexDirection: 'row', gap: 6 },
  dayBtn: {
    flex: 1, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  dayBtnActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  dayBtnText: { fontSize: 12, fontWeight: font.bold, color: colors.onSurface },

  footNote: {
    fontSize: 11, color: colors.onSurfaceSecondary, textAlign: 'center',
    marginTop: spacing.md, fontWeight: font.medium,
  },
});
