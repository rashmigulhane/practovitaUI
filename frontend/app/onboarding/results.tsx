import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import RiskGauge from '@/src/components/RiskGauge';
import PrimaryButton from '@/src/components/PrimaryButton';
import { riskScores } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

export default function ResultsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.eyebrowRow}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={16} color={colors.onBrandPrimary} />
          </View>
          <Text style={styles.eyebrow}>ASSESSMENT COMPLETE</Text>
        </View>

        <Text style={styles.title}>Your baseline risk scores</Text>
        <Text style={styles.subtitle}>
          Computed from your questionnaire responses. Upload a blood report to refine these further.
        </Text>

        {/* Diabetes */}
        <View style={[styles.card, shadows.card]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardEyebrow}>DIABETES</Text>
              <Text style={styles.cardTitle}>Type 2 risk</Text>
            </View>
            <Ionicons name="water-outline" size={22} color={colors.onSurfaceSecondary} />
          </View>
          <View style={{ alignItems: 'center', marginTop: spacing.md }}>
            <RiskGauge
              score={riskScores.diabetes.score}
              level={riskScores.diabetes.level}
              label="risk score"
              size={220}
            />
          </View>
          <View style={styles.factors}>
            <Text style={styles.factorLabel}>Key factors</Text>
            {riskScores.diabetes.factors.map((f) => (
              <View key={f} style={styles.factorRow}>
                <View style={styles.factorDot} />
                <Text style={styles.factorText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CVD */}
        <View style={[styles.card, shadows.card]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardEyebrow}>CARDIOVASCULAR</Text>
              <Text style={styles.cardTitle}>10-year CVD risk</Text>
            </View>
            <Ionicons name="heart-outline" size={22} color={colors.onSurfaceSecondary} />
          </View>
          <View style={{ alignItems: 'center', marginTop: spacing.md }}>
            <RiskGauge
              score={riskScores.cvd.score}
              level={riskScores.cvd.level}
              label="risk score"
              size={220}
            />
          </View>
          <View style={styles.factors}>
            <Text style={styles.factorLabel}>Key factors</Text>
            {riskScores.cvd.factors.map((f) => (
              <View key={f} style={styles.factorRow}>
                <View style={styles.factorDot} />
                <Text style={styles.factorText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            testID="results-continue-button"
            label="Continue to dashboard"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingBottom: spacing.xxl },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrow: { fontSize: 11, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.6 },
  title: {
    fontSize: 30, fontWeight: font.bold, color: colors.onSurface,
    marginTop: spacing.md, letterSpacing: -0.8, lineHeight: 36,
  },
  subtitle: { fontSize: type.base, color: colors.onSurfaceSecondary, marginTop: spacing.sm, lineHeight: 22 },
  card: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardEyebrow: { fontSize: 10, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.4 },
  cardTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, marginTop: 2, letterSpacing: -0.3 },
  factors: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider, gap: 8 },
  factorLabel: { fontSize: 11, fontWeight: font.bold, color: colors.onSurfaceSecondary, letterSpacing: 1.2 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  factorDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: colors.brand },
  factorText: { fontSize: type.base, color: colors.onSurface },
  footer: { marginTop: spacing.xl },
});
