// CineVerse Design System — Typography Tokens
import {Platform} from 'react-native';

export const FontFamily = {
  regular: Platform.OS === 'android' ? 'Roboto' : 'System',
  medium: Platform.OS === 'android' ? 'Roboto-Medium' : 'System',
  bold: Platform.OS === 'android' ? 'Roboto-Bold' : 'System',
  light: Platform.OS === 'android' ? 'Roboto-Light' : 'System',
  thin: Platform.OS === 'android' ? 'Roboto-Thin' : 'System',
};

export const FontSize = {
  xxs: 9,
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  hero: 48,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const FontWeight = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  semibold: '600',
  bold: '700',
  extraBold: '800',
  extrabold: '800',
};

export const Typography = {
  fontSize: FontSize,
  fontWeight: FontWeight,
  heroTitle: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.1,
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  body: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: 24,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },
  overline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};
