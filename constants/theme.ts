/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#4C7EFF'; // From Figma design
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#0C1C33', // From Figma design
    tabIconSelected: tintColorLight,
    overlay: 'rgba(0, 0, 0, 0.08)',
    overlayStrong: 'rgba(0, 0, 0, 0.12)',
    // Glassmorphism colors from Figma
    glassBackground: 'rgba(255, 255, 255, 0.32)',
    glassActiveTab: 'rgba(161, 161, 161, 0.2)',
    glassShadow: 'rgba(20, 20, 20, 0.24)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    overlay: 'rgba(255, 255, 255, 0.08)',
    overlayStrong: 'rgba(255, 255, 255, 0.12)',
    // Glassmorphism colors - to be defined for dark mode
    glassBackground: 'rgba(0, 0, 0, 0.32)',
    glassActiveTab: 'rgba(161, 161, 161, 0.2)',
    glassShadow: 'rgba(255, 255, 255, 0.24)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
