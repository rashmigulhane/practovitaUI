import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import PrimaryButton from '@/src/components/PrimaryButton';
import { questionnaire } from '@/src/data/mock';
import { colors, font, radius, spacing, type } from '@/src/theme/tokens';

export default function QuestionnaireScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const total = questionnaire.length;
  const q = questionnaire[step];
  const progress = useMemo(() => ((step + 1) / total) * 100, [step, total]);

  const canProceed = answers[q.id] !== undefined && answers[q.id] !== '';

  const next = () => {
    Haptics.selectionAsync().catch(() => {});
    if (step < total - 1) setStep(step + 1);
    else router.replace('/onboarding/results');
  };

  const back = () => {
    if (step === 0) router.back();
    else setStep(step - 1);
  };

  const setAns = (v: string | number) => {
    setAnswers((a) => ({ ...a, [q.id]: v }));
    Haptics.selectionAsync().catch(() => {});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable testID="questionnaire-back" onPress={back} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.stepText}>Step {step + 1} of {total}</Text>
        <View style={styles.iconBtn} />
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{q.title}</Text>
          {q.subtitle ? <Text style={styles.subtitle}>{q.subtitle}</Text> : null}

          <View style={styles.answers}>
            {q.type === 'number' && (
              <View style={styles.numberWrap}>
                <TextInput
                  testID={`q-${q.id}-input`}
                  keyboardType="number-pad"
                  value={String(answers[q.id] ?? '')}
                  onChangeText={(v) => setAns(v.replace(/[^0-9.]/g, ''))}
                  placeholder="0"
                  placeholderTextColor={colors.onSurfaceSecondary}
                  style={styles.numberInput}
                />
                <Text style={styles.numberUnit}>{q.unit}</Text>
              </View>
            )}

            {q.type === 'select' &&
              q.options?.map((o) => {
                const selected = answers[q.id] === o.value;
                return (
                  <Pressable
                    key={String(o.value)}
                    testID={`q-${q.id}-option-${o.value}`}
                    onPress={() => setAns(o.value)}
                    style={[styles.option, selected && styles.optionSelected]}
                  >
                    <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                      {o.label}
                    </Text>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            testID="questionnaire-next-button"
            label={step === total - 1 ? 'See my results' : 'Continue'}
            onPress={next}
            disabled={!canProceed}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceTertiary,
  },
  stepText: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  progressTrack: {
    height: 4, backgroundColor: colors.surfaceTertiary,
    marginHorizontal: spacing.lg, borderRadius: 999, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.brand, borderRadius: 999 },
  body: { padding: spacing.lg, paddingTop: spacing.xl },
  title: {
    fontSize: 30, fontWeight: font.bold, color: colors.onSurface,
    letterSpacing: -0.8, lineHeight: 36,
  },
  subtitle: { fontSize: type.lg, color: colors.onSurfaceSecondary, marginTop: spacing.md, lineHeight: 24 },
  answers: { marginTop: spacing.xl, gap: spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 18,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.brand, backgroundColor: colors.brandTertiary },
  optionLabel: { fontSize: type.lg, color: colors.onSurface, fontWeight: font.medium },
  optionLabelSelected: { color: colors.onBrandTertiary, fontWeight: font.semibold },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  numberWrap: {
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.lg,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary, minHeight: 100,
  },
  numberInput: {
    fontSize: 56, fontWeight: font.bold, color: colors.onSurface,
    minWidth: 100, textAlign: 'center', letterSpacing: -1.5,
  },
  numberUnit: { fontSize: type.lg, color: colors.onSurfaceSecondary, marginLeft: spacing.sm, fontWeight: font.medium },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.divider, backgroundColor: colors.surface },
});
