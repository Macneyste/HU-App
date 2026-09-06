import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, radii, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const VARIANTS: Record<ButtonVariant, { container: ViewStyle; label: TextStyle; spinner: string }> = {
  primary: {
    container: { backgroundColor: colors.navy, borderColor: colors.navy },
    label: { color: '#FFFFFF' },
    spinner: '#FFFFFF',
  },
  secondary: {
    container: { backgroundColor: colors.emerald, borderColor: colors.emerald },
    label: { color: '#FFFFFF' },
    spinner: '#FFFFFF',
  },
  accent: {
    container: { backgroundColor: colors.gold, borderColor: colors.gold },
    label: { color: colors.navyDark },
    spinner: colors.navyDark,
  },
  outline: {
    container: { backgroundColor: colors.surface, borderColor: colors.border },
    label: { color: colors.navy },
    spinner: colors.navy,
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderColor: 'transparent' },
    label: { color: colors.navy },
    spinner: colors.navy,
  },
  danger: {
    container: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
    label: { color: colors.danger },
    spinner: colors.danger,
  },
};

const SIZES: Record<ButtonSize, { container: ViewStyle; label: TextStyle }> = {
  sm: { container: { minHeight: 40, paddingHorizontal: 15 }, label: { fontSize: 13 } },
  md: { container: { minHeight: 48, paddingHorizontal: 20 }, label: { fontSize: 15 } },
  lg: { container: { minHeight: 54, paddingHorizontal: 24 }, label: { fontSize: 16 } },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = VARIANTS[variant];
  const sizeStyle = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        variant === 'primary' && shadows.card,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.spinner} />
      ) : (
        <>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[styles.label, variantStyle.label, sizeStyle.label]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '800', letterSpacing: 0.1 },
  icon: { marginRight: 8 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.48 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
