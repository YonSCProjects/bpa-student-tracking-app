import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { HEBREW_FONT_FAMILY } from '@/constants';

const fontConfig = {
  fontFamily: HEBREW_FONT_FAMILY,
};

const fonts = configureFonts({
  config: {
    default: fontConfig,
    ios: fontConfig,
    android: fontConfig,
  },
});

export const theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03DAC6',
    surface: '#FFFFFF',
    background: '#F5F5F5',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
  },
  roundness: 8,
};

export const hebrewTextStyle = {
  fontFamily: HEBREW_FONT_FAMILY,
  textAlign: 'right' as const,
  writingDirection: 'rtl' as const,
};

export const colors = theme.colors;