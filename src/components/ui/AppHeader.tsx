import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typeStyles } from '../../theme';

interface AppHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

export function AppHeader({ eyebrow, title, subtitle, right, children }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.navyDark, colors.navy, colors.navyLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: Math.max(insets.top + 12, 32) }]}
    >
      <View pointerEvents="none" style={styles.glowLarge} />
      <View pointerEvents="none" style={styles.glowSmall} />
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {children ? <View style={styles.children}>{children}</View> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  glowLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -78,
    top: -88,
    backgroundColor: 'rgba(244,183,64,0.10)',
  },
  glowSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    right: 34,
    bottom: -78,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    paddingRight: 16,
  },
  eyebrow: {
    ...typeStyles.eyebrow,
    color: colors.gold,
    marginBottom: 5,
  },
  title: {
    ...typeStyles.title,
    color: '#FFFFFF',
  },
  subtitle: {
    ...typeStyles.caption,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 5,
  },
  right: {
    flexShrink: 0,
  },
  children: {
    marginTop: 18,
  },
});
