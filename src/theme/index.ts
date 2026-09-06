import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  navy: '#062B50',
  navyDark: '#041E38',
  navyLight: '#174B78',
  emerald: '#087F5B',
  emeraldDark: '#056047',
  gold: '#F4B740',
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  text: '#102033',
  textMuted: '#64748B',
  textSoft: '#94A3B8',
  border: '#E3EAF2',
  danger: '#DC2626',
  warning: '#B45309',
  info: '#0369A1',
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
    shadowColor: '#0F2742',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#041E38',
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
