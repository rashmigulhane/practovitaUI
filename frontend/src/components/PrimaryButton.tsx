import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, font, radius, spacing } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export default function PrimaryButton({ label, onPress, variant = 'primary', disabled, loading, style, testID }: Props) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const bg =
    variant === 'primary' ? colors.brandPrimary :
    variant === 'secondary' ? colors.brandTertiary :
    'transparent';
  const fg =
    variant === 'primary' ? colors.onBrandPrimary :
    variant === 'secondary' ? colors.onBrandTertiary :
    colors.brand;
  const border = variant === 'ghost' ? colors.borderStrong : 'transparent';

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: border, borderWidth: variant === 'ghost' ? 1 : 0, opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: font.semibold,
    letterSpacing: 0.1,
  },
});
