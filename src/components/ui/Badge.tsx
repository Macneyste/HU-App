import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: '#DCFCE7', text: '#00875A', border: '#86EFAC' },
  warning: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  danger: { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' },
  info: { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
  primary: { bg: '#E0E7FF', text: '#002147', border: '#C7D2FE' },
  neutral: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const config = BADGE_CONFIG[variant];
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 10,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: isSm ? 10 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
