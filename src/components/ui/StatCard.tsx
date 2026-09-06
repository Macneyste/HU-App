/**
 * ─────────────────────────────────────────────────────────────
 *  HU — Stat Card Component
 *
 *  Compact statistic display for the dashboard: icon, value,
 *  label, and optional color accent bar.
 * ─────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  accentColor?: string;
  style?: ViewStyle;
}

export function StatCard({
  icon,
  value,
  label,
  accentColor = '#002147',
  style,
}: StatCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          padding: 14,
          flex: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
          borderLeftWidth: 3,
          borderLeftColor: accentColor,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: `${accentColor}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        {icon}
      </View>

      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: '#1F2937',
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: '#6B7280',
          marginTop: 2,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
