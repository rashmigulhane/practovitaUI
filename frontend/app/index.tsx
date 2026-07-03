import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import PrimaryButton from '@/src/components/PrimaryButton';
import { colors, font, radius, spacing, type } from '@/src/theme/tokens';

const HERO =
  'https://images.unsplash.com/photo-1592355591829-aaae33fcff1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaGVhbHRoJTIwd2VsbG5lc3MlMjBsaWZlc3R5bGV8ZW58MHx8fHwxNzgzMDU5OTAyfDA&ixlib=rb-4.1.0&q=85';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.root} testID="welcome-screen">
      <View style={styles.heroWrap}>
        <Image source={{ uri: HERO }} style={styles.hero} />
        <LinearGradient
          colors={['rgba(253,253,252,0)', 'rgba(253,253,252,0.65)', '#FDFDFC']}
          locations={[0, 0.55, 1]}
          style={styles.scrim}
        />
      </View>

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.brandRow}>
          <View style={styles.logoDot}>
            <Ionicons name="leaf" size={16} color={colors.onBrandPrimary} />
          </View>
          <Text style={styles.brand}>Practavita</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.bodyScroll} bounces={false}>
        <View style={styles.body}>
          <Text style={styles.eyebrow}>YOUR HEALTH JOURNEY, GUIDED</Text>
          <Text style={styles.headline}>
            A calm space{"\n"}for your{" "}
            <Text style={{ color: colors.brand }}>wellbeing.</Text>
          </Text>
          <Text style={styles.sub}>
            Assess your risk, understand your labs, and get personalised guidance — all in one place.
          </Text>

          <View style={styles.features}>
            <Feature icon="pulse-outline" label="Risk scoring" />
            <Feature icon="document-text-outline" label="Lab insights" />
            <Feature icon="chatbubbles-outline" label="Ask Me AI" />
            <Feature icon="watch-outline" label="Wearables" />
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <PrimaryButton
          testID="welcome-get-started-button"
          label="Get started"
          onPress={() => router.push('/onboarding/questionnaire')}
        />
        <Pressable
          testID="welcome-sign-in-link"
          onPress={() => router.push('/(tabs)')}
          style={styles.signIn}
        >
          <Text style={styles.signInText}>I already have an account</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function Feature({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.feat}>
      <View style={styles.featIcon}>
        <Ionicons name={icon} size={16} color={colors.brand} />
      </View>
      <Text style={styles.featLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  heroWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 460,
  },
  hero: { width: '100%', height: '100%' },
  scrim: { ...StyleSheet.absoluteFillObject },
  safeTop: { paddingHorizontal: spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  logoDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  brand: { fontSize: type.lg, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.2 },
  bodyScroll: { flexGrow: 1, justifyContent: 'flex-end' },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  eyebrow: { fontSize: 11, fontWeight: font.bold, color: colors.brand, letterSpacing: 1.6, marginBottom: spacing.md },
  headline: { fontSize: 40, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -1.2, lineHeight: 44 },
  sub: { fontSize: type.lg, color: colors.onSurfaceSecondary, marginTop: spacing.md, lineHeight: 24 },
  features: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xl,
  },
  feat: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  featIcon: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  featLabel: { fontSize: 13, color: colors.onSurface, fontWeight: font.medium },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  signIn: { alignItems: 'center', paddingVertical: spacing.sm },
  signInText: { color: colors.onSurfaceSecondary, fontSize: type.base, fontWeight: font.medium },
});
