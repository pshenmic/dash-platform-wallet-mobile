import { Ionicons } from '@expo/vector-icons';
import { Identifier } from 'dash-ui-kit/react-native';
import { Pressable, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface AddressDisplayProps {
  /**
   * User wallet address to display
   */
  address: string;
  /**
   * Handler called when address is pressed
   */
  onPress?: () => void;
}

/**
 * Address display component using dash-ui-kit Identifier
 * 
 * Displays user's wallet address with:
 * - Avatar icon (colored circle)
 * - Middle truncation (e.g., "6Eb4...p24c")
 * - Dropdown chevron icon on the right
 */
export function AddressDisplay({ address, onPress }: AddressDisplayProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      <Identifier
        truncate="middle"
        avatar
        style={styles.identifier}
        middleEllipsis={true}
        edgeChars={4}
      >
        {address}
      </Identifier>
      <Ionicons
        name="chevron-down" 
        size={16} 
        color={iconColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  identifier: {
    flex: 1,
  },
});
