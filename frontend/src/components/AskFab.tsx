import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, font, shadows } from '../theme/tokens';

type Props = { bottom?: number };

export default function AskFab({ bottom = 100 }: Props) {
  const router = useRouter();
  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      <Pressable
        testID="ask-fab"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          router.push('/ask');
        }}
        style={({ pressed }) => [styles.btn, shadows.cardStrong, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <Ionicons name="sparkles" size={20} color={colors.onBrandPrimary} />
        <Text style={styles.label}>Ask</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
  label: { color: colors.onBrandPrimary, fontSize: 13, fontWeight: font.bold, letterSpacing: 0.2 },
});
