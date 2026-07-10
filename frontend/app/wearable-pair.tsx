import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '@/src/components/ScreenHeader';
import PrimaryButton from '@/src/components/PrimaryButton';
import { nearbyDevices, availableDevices } from '@/src/data/mock';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

type Stage = 'scanning' | 'found' | 'pairing' | 'connected';

export default function WearablePairScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ device?: string }>();
  const preselected = availableDevices.find((d) => d.id === params.device);

  const [stage, setStage] = useState<Stage>('scanning');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pairingProgress, setPairingProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'scanning') return;
    const t = setTimeout(() => setStage('found'), 2500);
    return () => clearTimeout(t);
  }, [stage]);

  const pair = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedId(id);
    setStage('pairing');
    setPairingProgress(0);
    const iv = setInterval(() => {
      setPairingProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(() => setStage('connected'), 400);
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/wearable');
  };

  const rescan = () => {
    Haptics.selectionAsync().catch(() => {});
    setStage('scanning');
    setSelectedId(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Add a device"
        subtitle={preselected ? `Pair with ${preselected.name}` : 'Scanning nearby devices'}
        showBack
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {stage === 'scanning' && (
          <View style={[styles.scanBox, shadows.card]}>
            <View style={styles.pulseRing}>
              <View style={styles.pulseInner}>
                <Ionicons name="bluetooth-outline" size={30} color={colors.brand} />
              </View>
            </View>
            <ActivityIndicator color={colors.brand} style={{ marginTop: spacing.md }} />
            <Text style={styles.scanTitle}>Searching for devices…</Text>
            <Text style={styles.scanSub}>Make sure your wearable is nearby, powered on, and in pairing mode.</Text>
          </View>
        )}

        {stage === 'found' && (
          <>
            <View style={styles.foundHead}>
              <View>
                <Text style={styles.foundTitle}>Nearby devices</Text>
                <Text style={styles.foundSub}>{nearbyDevices.length} devices found</Text>
              </View>
              <Pressable testID="rescan" onPress={rescan} style={styles.rescanBtn}>
                <Ionicons name="refresh-outline" size={16} color={colors.brand} />
                <Text style={styles.rescanText}>Rescan</Text>
              </Pressable>
            </View>

            <View style={styles.list}>
              {nearbyDevices.map((d, i) => (
                <Pressable
                  key={d.id}
                  testID={`pair-${d.id}`}
                  onPress={() => pair(d.id)}
                  style={[styles.deviceRow, i < nearbyDevices.length - 1 && styles.rowBorder]}
                >
                  <View style={styles.deviceIconLarge}>
                    <Ionicons name={d.icon as any} size={22} color={colors.brand} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deviceName}>{d.name}</Text>
                    <View style={styles.signalRow}>
                      <Text style={styles.brand}>{d.brand}</Text>
                      <View style={styles.dot} />
                      <View style={styles.signalBars}>
                        {[1, 2, 3, 4].map((b) => (
                          <View
                            key={b}
                            style={[
                              styles.signalBar,
                              { height: 4 + b * 2, backgroundColor: b <= Math.ceil(d.signal / 25) ? colors.brand : colors.borderStrong },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={styles.signalText}>{d.signal}%</Text>
                    </View>
                  </View>
                  <View style={styles.pairPill}>
                    <Text style={styles.pairPillText}>Pair</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.helpBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.brand} />
              <Text style={styles.helpText}>
                Not seeing your device? Bring it within 3 meters and enable Bluetooth pairing mode.
              </Text>
            </View>
          </>
        )}

        {stage === 'pairing' && selectedId && (
          <View style={[styles.scanBox, shadows.card]}>
            <View style={styles.pulseInner}>
              <Ionicons name="bluetooth" size={30} color={colors.brand} />
            </View>
            <Text style={styles.scanTitle}>
              Pairing with {nearbyDevices.find((d) => d.id === selectedId)?.name}
            </Text>
            <Text style={styles.scanSub}>Follow any prompts on your device to confirm.</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pairingProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{pairingProgress}%</Text>
          </View>
        )}

        {stage === 'connected' && selectedId && (
          <View style={[styles.scanBox, shadows.card]}>
            <View style={[styles.pulseInner, { backgroundColor: colors.brand }]}>
              <Ionicons name="checkmark" size={30} color={colors.onBrandPrimary} />
            </View>
            <Text style={styles.scanTitle}>
              {nearbyDevices.find((d) => d.id === selectedId)?.name} connected
            </Text>
            <Text style={styles.scanSub}>Data will start flowing in the next few minutes.</Text>
            <View style={styles.permGrid}>
              <PermRow icon="walk-outline" label="Activity & steps" />
              <PermRow icon="heart-outline" label="Heart rate & HRV" />
              <PermRow icon="moon-outline" label="Sleep stages" />
              <PermRow icon="flame-outline" label="Calories burned" />
            </View>
            <PrimaryButton
              testID="finish-pair"
              label="Done"
              onPress={finish}
              style={{ marginTop: spacing.lg, width: '100%' }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PermRow({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.permRow}>
      <View style={styles.permCheck}>
        <Ionicons name="checkmark" size={12} color={colors.onBrandPrimary} />
      </View>
      <Ionicons name={icon as any} size={14} color={colors.brand} />
      <Text style={styles.permText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingTop: 0 },

  scanBox: {
    padding: spacing.xl, borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  pulseRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  pulseInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.brandSecondary + '55',
  },
  scanTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, marginTop: spacing.md, textAlign: 'center', letterSpacing: -0.3 },
  scanSub: { fontSize: 13, color: colors.onSurfaceSecondary, textAlign: 'center', marginTop: 6, lineHeight: 19 },

  foundHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  foundTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.3 },
  foundSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  rescanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: colors.brandTertiary,
  },
  rescanText: { fontSize: 12, fontWeight: font.bold, color: colors.brand },

  list: {
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  deviceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  deviceIconLarge: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  deviceName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  brand: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  dot: { width: 3, height: 3, borderRadius: 999, backgroundColor: colors.onSurfaceSecondary, opacity: 0.6 },
  signalBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 12 },
  signalBar: { width: 3, borderRadius: 1 },
  signalText: { fontSize: 11, color: colors.onSurfaceSecondary, fontWeight: font.medium },
  pairPill: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, backgroundColor: colors.brand,
  },
  pairPillText: { color: colors.onBrandPrimary, fontSize: 12, fontWeight: font.bold },

  helpBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginTop: spacing.md, padding: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.brandTertiary,
  },
  helpText: { flex: 1, fontSize: 12, color: colors.onBrandTertiary, lineHeight: 17 },

  progressTrack: {
    width: '100%', height: 6, borderRadius: 3,
    backgroundColor: colors.surfaceTertiary, marginTop: spacing.lg, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.brand, borderRadius: 3 },
  progressText: { fontSize: 13, color: colors.brand, fontWeight: font.bold, marginTop: 8 },

  permGrid: { width: '100%', marginTop: spacing.lg, gap: 8 },
  permRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 10, borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
  },
  permCheck: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  permText: { fontSize: 13, color: colors.onBrandTertiary, fontWeight: font.semibold },
});
