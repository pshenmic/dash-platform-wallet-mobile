import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export interface NotificationButtonProps {
  /**
   * Handler called when notification button is pressed
   */
  onPress?: () => void;
}

const useNativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

/** Figma: rgba(255, 255, 255, 0.12) — glass fill for header on gradient background */
const GLASS_FILL = 'rgba(255, 255, 255, 0.12)';

/**
 * Notification button with bell icon
 *
 * Displays a liquid glass button with a bell icon for notifications.
 * Designed to sit on the blue gradient hero area of the home screen.
 */
export function NotificationButton({ onPress }: NotificationButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      <View style={styles.container}>
        {useNativeGlass ? (
          <GlassView style={StyleSheet.absoluteFill} />
        ) : (
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        )}
        <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 48,
    backgroundColor: GLASS_FILL,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  container: {
    borderRadius: 48,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
