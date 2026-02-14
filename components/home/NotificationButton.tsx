import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface NotificationButtonProps {
  /**
   * Handler called when notification button is pressed
   */
  onPress?: () => void;
}

/**
 * Notification button with bell icon
 * 
 * Displays a semi-transparent button with a bell icon for notifications.
 * Positioned in the top-right of the header.
 */
export function NotificationButton({ onPress }: NotificationButtonProps) {
  const iconColor = useThemeColor({}, 'text');
  const overlayColor = useThemeColor({}, 'overlayStrong');

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.container, backgroundColor: overlayColor },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      <Ionicons name="notifications-outline" size={20} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 48,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
