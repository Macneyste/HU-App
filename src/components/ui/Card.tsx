import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../../theme';

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  shadow?: ShadowLevel;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  accessibilityLabel?: string;
}

const SHADOWS: Record<ShadowLevel, ViewStyle> = {
  none: {},
  sm: { ...shadows.card, shadowOpacity: 0.045, elevation: 1 },
  md: shadows.card,
  lg: shadows.floating,
};

export function Card({
  children,
  shadow = 'sm',
  onPress,
  style,
  padding = 16,
  accessibilityLabel,
}: CardProps) {
  const cardStyle = [styles.card, SHADOWS[shadow], { padding }, style];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.84, transform: [{ scale: 0.992 }] },
});
