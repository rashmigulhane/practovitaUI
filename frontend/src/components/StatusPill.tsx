import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, radius } from '../theme/tokens';

type Status = 'success' | 'warning' | 'error' | 'info';
export default function StatusPill({ status, label }: { status: Status; label: string }) {
  const map: Record<Status, { bg: string; fg: string }> = {
    success: { bg: colors.brandTertiary, fg: colors.onBrandTertiary },
    warning: { bg: '#FBE7D6', fg: '#8A4A20' },
    error: { bg: '#F6DAD5', fg: '#7A2E29' },
    info: { bg: colors.surfaceTertiary, fg: colors.onSurfaceTertiary },
  };
  const c = map[status];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 999, marginRight: 6, opacity: 0.7 },
  text: { fontSize: 11, fontWeight: font.semibold, letterSpacing: 0.2 },
});
