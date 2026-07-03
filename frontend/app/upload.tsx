import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import PrimaryButton from '@/src/components/PrimaryButton';
import ScreenHeader from '@/src/components/ScreenHeader';
import { colors, font, radius, shadows, spacing, type } from '@/src/theme/tokens';

type Stage = 'idle' | 'uploading' | 'extracting' | 'normalizing' | 'matching' | 'done';

const PIPELINE: { key: Stage; label: string; desc: string }[] = [
  { key: 'uploading', label: 'Uploading document', desc: 'Encrypting & sending securely' },
  { key: 'extracting', label: 'Extracting metrics', desc: 'AI reading your report' },
  { key: 'normalizing', label: 'Normalising parameters', desc: 'Mapping to canonical names' },
  { key: 'matching', label: 'Reference range check', desc: 'Comparing against your profile' },
];

export default function UploadScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<null | { name: string; size: string; type: 'pdf' | 'image' }>(null);
  const [stage, setStage] = useState<Stage>('idle');

  useEffect(() => {
    if (stage === 'idle' || stage === 'done') return;
    const order: Stage[] = ['uploading', 'extracting', 'normalizing', 'matching', 'done'];
    const idx = order.indexOf(stage);
    if (idx < 0) return;
    const next = order[idx + 1];
    const t = setTimeout(() => {
      Haptics.selectionAsync().catch(() => {});
      setStage(next);
    }, 1200);
    return () => clearTimeout(t);
  }, [stage]);

  const pick = (type: 'pdf' | 'image' | 'camera') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (type === 'pdf') setSelected({ name: 'Blood_Report_Nov_2025.pdf', size: '482 KB', type: 'pdf' });
    if (type === 'image') setSelected({ name: 'IMG_20251112.jpg', size: '1.8 MB', type: 'image' });
    if (type === 'camera') setSelected({ name: 'Scanned_report.jpg', size: '2.1 MB', type: 'image' });
  };

  const startProcessing = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setStage('uploading');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenHeader title="Upload blood report" subtitle="PDF or image" showBack />

      <ScrollView contentContainerStyle={styles.body}>
        {stage === 'idle' && !selected && (
          <>
            <View style={styles.dropZone}>
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload-outline" size={36} color={colors.brand} />
              </View>
              <Text style={styles.dropTitle}>Add your report</Text>
              <Text style={styles.dropSub}>Practavita will extract every metric, match reference ranges, and update your trends.</Text>
            </View>

            <View style={styles.sourceRow}>
              <SourceCard icon="document-outline" label="PDF file" onPress={() => pick('pdf')} testID="source-pdf" />
              <SourceCard icon="image-outline" label="From gallery" onPress={() => pick('image')} testID="source-gallery" />
              <SourceCard icon="camera-outline" label="Camera" onPress={() => pick('camera')} testID="source-camera" />
            </View>

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>Tips for best results</Text>
              <Tip text="Ensure the entire report is visible & well-lit" />
              <Tip text="Multi-page PDFs are fully supported" />
              <Tip text="Handwritten values may require manual review" />
            </View>
          </>
        )}

        {selected && stage === 'idle' && (
          <View style={styles.selectedBox}>
            <View style={styles.fileRow}>
              <View style={styles.fileIcon}>
                <Ionicons name={selected.type === 'pdf' ? 'document-text' : 'image'} size={22} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>{selected.name}</Text>
                <Text style={styles.fileSize}>{selected.size}</Text>
              </View>
              <Pressable testID="remove-file" onPress={() => setSelected(null)} hitSlop={12}>
                <Ionicons name="close-circle" size={22} color={colors.onSurfaceSecondary} />
              </Pressable>
            </View>
            <PrimaryButton
              testID="start-processing"
              label="Start processing"
              onPress={startProcessing}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        )}

        {(stage !== 'idle') && (
          <View style={styles.pipelineBox}>
            <Text style={styles.pipelineTitle}>Processing your report</Text>
            <Text style={styles.pipelineSub}>{selected?.name}</Text>
            <View style={styles.timeline}>
              {PIPELINE.map((s, i) => {
                const order = PIPELINE.findIndex((p) => p.key === stage);
                const currentIdx = stage === 'done' ? PIPELINE.length : order;
                const isDone = i < currentIdx;
                const isActive = i === currentIdx;
                return (
                  <View key={s.key} style={styles.timelineRow}>
                    <View style={styles.timelineIconCol}>
                      <View style={[
                        styles.timelineDot,
                        isDone && { backgroundColor: colors.brand, borderColor: colors.brand },
                        isActive && { borderColor: colors.brand, backgroundColor: colors.brandTertiary },
                      ]}>
                        {isDone ? (
                          <Ionicons name="checkmark" size={12} color={colors.onBrandPrimary} />
                        ) : isActive ? (
                          <View style={styles.activePulse} />
                        ) : null}
                      </View>
                      {i < PIPELINE.length - 1 && (
                        <View style={[styles.timelineLine, isDone && { backgroundColor: colors.brand }]} />
                      )}
                    </View>
                    <View style={{ flex: 1, paddingBottom: spacing.lg }}>
                      <Text style={[
                        styles.timelineLabel,
                        (isDone || isActive) && { color: colors.onSurface },
                      ]}>{s.label}</Text>
                      <Text style={styles.timelineDesc}>{s.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {stage === 'done' && (
              <View style={styles.successBox}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={40} color={colors.brand} />
                </View>
                <Text style={styles.successTitle}>Report processed!</Text>
                <Text style={styles.successSub}>Extracted 12 metrics · 3 need attention</Text>
                <PrimaryButton
                  testID="view-report-button"
                  label="View report"
                  onPress={() => router.replace('/report/r1')}
                  style={{ width: '100%', marginTop: spacing.md }}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SourceCard({ icon, label, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.source, shadows.card]}>
      <View style={styles.sourceIcon}>
        <Ionicons name={icon} size={22} color={colors.brand} />
      </View>
      <Text style={styles.sourceLabel}>{label}</Text>
    </Pressable>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <View style={styles.tipRow}>
      <Ionicons name="checkmark-circle" size={14} color={colors.brand} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, paddingBottom: spacing.xxl },
  dropZone: {
    borderWidth: 2, borderColor: colors.borderStrong, borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.sm,
  },
  uploadIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dropTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface },
  dropSub: { fontSize: type.base, color: colors.onSurfaceSecondary, textAlign: 'center', lineHeight: 20 },

  sourceRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  source: {
    flex: 1, padding: spacing.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', gap: spacing.sm, minHeight: 96, justifyContent: 'center',
  },
  sourceIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  sourceLabel: { fontSize: 12, fontWeight: font.semibold, color: colors.onSurface, textAlign: 'center' },

  tipsBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    gap: 8,
  },
  tipsTitle: { fontSize: 12, fontWeight: font.bold, color: colors.onBrandTertiary, letterSpacing: 1, marginBottom: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipText: { fontSize: 13, color: colors.onBrandTertiary, flex: 1 },

  selectedBox: {},
  fileRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  fileIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brandTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  fileName: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurface },
  fileSize: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },

  pipelineBox: {
    padding: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  pipelineTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onSurface },
  pipelineSub: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },
  timeline: { marginTop: spacing.lg },
  timelineRow: { flexDirection: 'row', gap: spacing.md },
  timelineIconCol: { alignItems: 'center', width: 24 },
  timelineDot: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.borderStrong, marginVertical: 4, minHeight: 20 },
  timelineLabel: { fontSize: type.base, fontWeight: font.semibold, color: colors.onSurfaceSecondary },
  timelineDesc: { fontSize: 12, color: colors.onSurfaceSecondary, marginTop: 2 },

  successBox: {
    marginTop: spacing.lg, padding: spacing.lg,
    borderRadius: radius.lg, backgroundColor: colors.brandTertiary,
    alignItems: 'center',
  },
  successIcon: {},
  successTitle: { fontSize: type.xl, fontWeight: font.bold, color: colors.onBrandTertiary, marginTop: spacing.sm },
  successSub: { fontSize: type.base, color: colors.onBrandTertiary, marginTop: 4 },
});
