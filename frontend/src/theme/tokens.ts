// Practavita design tokens (from design_guidelines.json)
export const colors = {
  surface: '#FDFDFC',
  onSurface: '#1C1C19',
  surfaceSecondary: '#FFFFFF',
  onSurfaceSecondary: '#5A5A55',
  surfaceTertiary: '#F2F2F0',
  onSurfaceTertiary: '#40403C',
  surfaceInverse: '#1F211F',
  onSurfaceInverse: '#FFFFFF',
  brand: '#5A7D66',
  brandPrimary: '#5A7D66',
  onBrandPrimary: '#FFFFFF',
  brandSecondary: '#88A392',
  onBrandSecondary: '#1C1C19',
  brandTertiary: '#E3EBE6',
  onBrandTertiary: '#3E5C4A',
  success: '#628A70',
  onSuccess: '#FFFFFF',
  warning: '#D18E62',
  onWarning: '#FFFFFF',
  error: '#C9665E',
  onError: '#FFFFFF',
  info: '#7C786E',
  onInfo: '#FFFFFF',
  border: '#EBEBE8',
  borderStrong: '#D6D6D2',
  divider: '#F2F2F0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const type = {
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 44,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const font = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
