import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type TransactionChain } from '@/types/transaction';
import { StyleSheet, View } from 'react-native';

export interface ChainBadgeProps {
  /**
   * Chain type: Core or Platform
   */
  chain: TransactionChain;
}

/**
 * Chain badge component
 * 
 * Displays a small pill-shaped badge with chain name:
 * - "Core" with blue tint background
 * - "Platform" with gray tint background
 */
export function ChainBadge({ chain }: ChainBadgeProps) {
  const tintColor = useThemeColor({}, 'tint');
  const overlayColor = useThemeColor({}, 'overlay');

  const backgroundColor = chain === 'Core' ? tintColor + '20' : overlayColor;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.text}>{chain}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
