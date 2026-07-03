import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, spacing, type } from '../theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function ScreenHeader({ title, subtitle, showBack, rightIcon, onRightPress }: Props) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack && (
          <Pressable
            testID="header-back-button"
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightIcon && (
          <Pressable testID="header-right-button" onPress={onRightPress} style={styles.iconBtn} hitSlop={12}>
            <Ionicons name={rightIcon} size={22} color={colors.onSurface} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceTertiary,
  },
  title: { fontSize: type.xxl, fontWeight: font.bold, color: colors.onSurface, letterSpacing: -0.4 },
  subtitle: { fontSize: type.base, color: colors.onSurfaceSecondary, marginTop: 2 },
});
