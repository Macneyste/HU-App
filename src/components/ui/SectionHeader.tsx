import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors, typeStyles } from '../../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <ArrowRight size={15} color={colors.emerald} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  copy: { flex: 1, paddingRight: 12 },
  title: { ...typeStyles.section, color: colors.text },
  subtitle: { ...typeStyles.caption, color: colors.textMuted, marginTop: 2 },
  action: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  actionLabel: { ...typeStyles.caption, color: colors.emerald, fontWeight: '800' },
  pressed: { opacity: 0.58 },
});
