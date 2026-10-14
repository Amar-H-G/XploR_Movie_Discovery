// CineVerse Design System — Spacing, Radius, Elevation, Animation Tokens

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  '2xl': 32,
  xxxl: 40,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  screenPadding: 16,
  sectionGap: 24,
  cardGap: 12,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
  round: 9999,
  card: 12,
  button: 10,
  chip: 20,
  image: 8,
};

export const Elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const AnimationDuration = {
  fast: 150,
  normal: 250,
  slow: 400,
  xslow: 600,
};

export const IconSize = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
  '2xl': 40,
};

export const ImageAspectRatio = {
  poster: 2 / 3, // 0.667 — w:h = 2:3
  backdrop: 16 / 9, // 1.778 — w:h = 16:9
  profile: 2 / 3,
  square: 1,
};

export const ImageSize = {
  posterSm: {width: 100, height: 150},
  posterMd: {width: 130, height: 195},
  posterLg: {width: 160, height: 240},
  backdropSm: {width: 220, height: 124},
  backdropMd: {width: 320, height: 180},
  backdropLg: {width: 500, height: 281},
  profileSm: {width: 60, height: 90},
  profileMd: {width: 90, height: 135},
};

export const ZIndex = {
  base: 0,
  above: 1,
  overlay: 10,
  modal: 100,
  toast: 200,
};
