import { Platform } from 'react-native';

export const colors = {
  bg: {
    primary: '#080D19',
    card: '#111827',
    cardDark: '#0C1220',
    elevated: '#1E293B',
    modal: '#18181B',
    modalCard: '#27272A',
  },
  border: {
    default: '#1F2937',
    subtle: '#1E293B',
    focus: '#3B82F6',
    medium: '#3F3F46',
    indicator: '#52525B',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#64748B',
    dim: '#475569',
    placeholder: '#4B5563',
    light: '#E4E4E7',
    bright: '#F4F4F5',
    icon: '#A1A1AA',
  },
  brand: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    accent: '#8B5CF6',
    accentDark: '#6D28D9',
    accentLight: '#A78BFA',
  },
  semantic: {
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    warning: '#F59E0B',
    warningDark: '#D97706',
    warningLight: '#FBBF24',
    danger: '#EF4444',
    dangerDark: '#DC2626',
    dangerLight: '#FF453A',
    dangerBg: '#991B1B',
    info: '#6B7280',
    infoDark: '#4B5563',
  },
  impact: {
    high: '#EF4444',
    highBg: '#991B1B',
    medium: '#F59E0B',
    mediumBg: '#92400E',
    low: '#64748B',
    lowBg: '#334155',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

export const typography = {
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 15,
    xl: 16,
    '2xl': 17,
    '3xl': 18,
    '4xl': 20,
    '5xl': 22,
    '6xl': 24,
    '7xl': 28,
    '8xl': 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    android: { elevation: 12 },
  }),
} as const;

export const glowShadow = (color: string) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    android: { elevation: 8 },
  });

export const gradients = {
  brand: ['#3B82F6', '#8B5CF6'] as const,
  brandDark: ['#2563EB', '#6D28D9'] as const,
  danger: ['#EF4444', '#DC2626'] as const,
  success: ['#10B981', '#059669'] as const,
  warning: ['#F59E0B', '#D97706'] as const,
} as const;
