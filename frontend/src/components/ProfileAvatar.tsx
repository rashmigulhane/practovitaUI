import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme/tokens';

type Props = { initials: string; color: string; size?: number; active?: boolean };

export default function ProfileAvatar({ initials, color, size = 52, active }: Props) {
  return (
    <View style={[
      styles.wrap,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      active && { borderWidth: 3, borderColor: colors.brand, padding: 0 },
    ]}>
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#FFF', fontWeight: font.bold, letterSpacing: 0.3 },
});
