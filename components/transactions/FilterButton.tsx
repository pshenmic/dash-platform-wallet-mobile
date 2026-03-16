import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface FilterButtonProps {
  /**
   * Handler called when filter button is pressed
   */
  onPress?: () => void;
}

/**
 * Filter button component
 * 
 * Small, subtle button with filter/funnel icon.
 * Positioned on the right side of the tabs navigation.
 */
export function FilterButton({ onPress }: FilterButtonProps) {
  const iconColor = useThemeColor({}, 'icon');
  const overlayColor = useThemeColor({}, 'overlay');

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.container, backgroundColor: overlayColor },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      <Ionicons name="options-outline" size={16} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
