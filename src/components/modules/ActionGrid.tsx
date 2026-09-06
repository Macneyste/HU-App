import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  GraduationCap,
  Wallet,
  BookOpen,
  Newspaper,
  FileCheck,
  IdCard,
  ChevronRight,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { ActionItem } from '../../types';
import { colors, radii, shadows, typeStyles } from '../../theme';

interface ActionGridProps {
  items: ActionItem[];
  onItemPress?: (item: ActionItem) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  Wallet,
  BookOpen,
  Newspaper,
  FileCheck,
  IdCard,
};

export const ActionGrid: React.FC<ActionGridProps> = ({ items, onItemPress }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;
  const availableWidth = Math.min(width, 840) - 32;
  const itemWidth = (availableWidth - 12 * (columns - 1)) / columns;

  const handlePress = (item: ActionItem) => {
    if (onItemPress) onItemPress(item);
    else router.push(item.route as never);
  };

  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon] ?? GraduationCap;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.label}`}
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              styles.card,
              { width: itemWidth },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.icon, { backgroundColor: `${item.color}14` }]}>
              <Icon size={22} color={item.color} strokeWidth={2.2} />
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            <ChevronRight size={16} color={colors.textSoft} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    minHeight: 70,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: { ...typeStyles.caption, color: colors.text, flex: 1, fontWeight: '800' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});
