import { Platform, type TextStyle } from 'react-native';

export const COLORS = {
  bg: '#030C19',
  surface: '#021633',
  surfaceElevated: '#01224F',
  divider: '#092C53',

  textPrimary: '#EAF2FB',
  textSecondary: '#94BBDD',
  textMuted: '#5D97C2',

  accent: '#F0C000',
  onAccent: '#000000',
  onAccentMuted: 'rgba(0,0,0,0.6)',

  danger: '#EF4444',

  success: '#22C55E',
  warning: '#F59E0B',
  warningSoft: 'rgba(245,158,11,0.15)',
  error: '#EF4444',

  brand: '#003785',
  brandMid: '#1465BB',
  brandLight: '#2196F3',
  brandPale: '#81C9FA',
  chartNeutral: '#4A6C94',

  category: {
    pickup: '#2196F3',
    suv: '#16A34A',
    sedan: '#7C3AED',
    hatch: '#0891B2',
    outro: '#3B5F86',
  },

  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const TYPOGRAPHY: { numeric: TextStyle } = {
  numeric: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontVariant: ['tabular-nums'],
  },
};
