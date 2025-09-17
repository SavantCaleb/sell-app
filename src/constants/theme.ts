export const Colors = {
  primary: '#FFFFFF',
  accent: '#00C853', // Money Green
  text: '#000000',
  subtle: '#F5F5F5',
  gray: '#8E8E93',
  danger: '#FF3B30',
  warning: '#FF9500',
  success: '#00C853',
};

export const Typography = {
  largeTitle: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.gray,
  },
  money: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
};