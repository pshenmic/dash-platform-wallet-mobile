import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface WalletSelectorProps {
  /**
   * Wallet name to display
   */
  name: string;
  /**
   * Wallet type to display below the name
   */
  type: string;
  /**
   * Handler called when wallet selector is pressed
   */
  onPress?: () => void;
}

/**
 * Wallet selector button component
 * 
 * Displays a button with wallet icon, name, type, and dropdown chevron.
 * Used in the header to allow users to switch between wallets.
 */
export function WalletSelector({ name, type, onPress }: WalletSelectorProps) {
  const iconColor = useThemeColor({}, 'text');
  const overlayColor = useThemeColor({}, 'overlayStrong');
  const overlayLightColor = useThemeColor({}, 'overlay');

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.container, backgroundColor: overlayColor },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      {/* Wallet Icon */}
      <View style={[styles.iconContainer, { backgroundColor: overlayLightColor }]}>
        <MaterialCommunityIcons 
          name="wallet-outline" 
          size={24} 
          color={iconColor} 
        />
      </View>

      {/* Wallet Info */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.walletName} numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText style={styles.walletType} numberOfLines={1}>
          {type}
        </ThemedText>
      </View>

      {/* Chevron Icon */}
      <Ionicons 
        name="chevron-down" 
        size={16} 
        color={iconColor} 
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  walletName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  walletType: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  chevron: {
    marginLeft: 4,
  },
});
