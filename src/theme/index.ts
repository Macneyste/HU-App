import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#148154',
  primaryDark: '#0F6843',
  primarySoft: '#E8F3EE',
  secondary: '#2C85B7',
  secondaryDark: '#236E98',
  secondarySoft: '#EAF4F9',
  navy: '#148154',
  navyDark: '#0F6843',
  navyLight: '#2C85B7',
  emerald: '#148154',
  emeraldDark: '#0F6843',
  gold: '#2C85B7',
  background: '#F8FAF9',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F2',
  text: '#202522',
  textMuted: '#606862',
  textSoft: '#8D9690',
  border: '#D9E0DC',
  borderStrong: '#C8D1CB',
  danger: '#DC2626',
  warning: '#A15C00',
  info: '#2C85B7',
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const shadows: Record<'card' | 'floating', ViewStyle> = {
  card: {
    shadowColor: '#183123',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#183123',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const typeStyles: Record<'eyebrow' | 'title' | 'section' | 'body' | 'caption', TextStyle> = {
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  section: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
};
